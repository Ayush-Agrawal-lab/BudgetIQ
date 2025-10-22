import * as React from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '../dialog';
import { act } from 'react-dom/test-utils';

// Spy on console.error/warn to detect unwanted warnings
const originalError = console.error;
const originalWarn = console.warn;
let consoleOutput = {
  error: [],
  warn: []
};

beforeAll(() => {
  console.error = jest.fn((...args) => {
    consoleOutput.error.push(args);
  });
  console.warn = jest.fn((...args) => {
    consoleOutput.warn.push(args);
  });
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

beforeEach(() => {
  consoleOutput = {
    error: [],
    warn: []
  };
});

describe('Dialog Component', () => {
  it('should render without warnings when DialogDescription is provided', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
          <DialogDescription>This is a test dialog.</DialogDescription>
          <div>Content goes here</div>
        </DialogContent>
      </Dialog>
    );
    
    // Verify no warnings about missing description
    expect(consoleOutput.warn).toEqual([]);
    expect(consoleOutput.error).toEqual([]);
  });

  it('should render without warnings when DialogDescription is nested', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
          <div>
            <div>
              <DialogDescription>Deeply nested description.</DialogDescription>
            </div>
          </div>
          <div>Content goes here</div>
        </DialogContent>
      </Dialog>
    );
    
    // Verify no warnings about missing description
    expect(consoleOutput.warn).toEqual([]);
    expect(consoleOutput.error).toEqual([]);
  });

  it('should render without warnings when no explicit DialogDescription is provided', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
          <div>Content without explicit description</div>
        </DialogContent>
      </Dialog>
    );
    
    // Should use fallback description without warnings
    expect(consoleOutput.warn).toEqual([]);
    expect(consoleOutput.error).toEqual([]);
  });

  it('should maintain aria-describedby relationship with DialogDescription', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
          <DialogDescription>This is a test dialog.</DialogDescription>
          <div>Content goes here</div>
        </DialogContent>
      </Dialog>
    );

    // Find the dialog content and description
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).toHaveAttribute('aria-describedby');
    
    const descriptionId = dialog.getAttribute('aria-describedby');
    const description = document.getElementById(descriptionId);
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('This is a test dialog.');
  });

  it('should add sr-only description when none provided', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
          <div>Content without explicit description</div>
        </DialogContent>
      </Dialog>
    );

    // Find the dialog content
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).toHaveAttribute('aria-describedby');
    
    const descriptionId = dialog.getAttribute('aria-describedby');
    const description = document.getElementById(descriptionId);
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('sr-only');
  });

  it('should use existing description ID if provided', () => {
    const customId = 'custom-description-id';
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
          <DialogDescription id={customId}>Custom ID description.</DialogDescription>
          <div>Content goes here</div>
        </DialogContent>
      </Dialog>
    );

    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).toHaveAttribute('aria-describedby', customId);
    
    const description = document.getElementById(customId);
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('Custom ID description.');
  });
  
  // Test accessibility
  it('should not have any accessibility violations', async () => {
    const { container } = render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Accessible Dialog</DialogTitle>
          <DialogDescription>This dialog follows accessibility guidelines.</DialogDescription>
          <div>Dialog content</div>
        </DialogContent>
      </Dialog>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Test interactive behavior
  it('should handle opening and closing via trigger button', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
          <DialogDescription>Interactive test dialog.</DialogDescription>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>
    );

    // Initially dialog should not be visible
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Open dialog
    await user.click(screen.getByText('Open Dialog'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Close dialog
    await user.click(screen.getByText('Close'));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  // Test keyboard navigation
  it('should handle keyboard interactions correctly', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Keyboard Test</DialogTitle>
          <DialogDescription>Test keyboard navigation.</DialogDescription>
          <input placeholder="Test input" />
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>
    );

    // Open dialog
    await user.click(screen.getByText('Open Dialog'));
    
    // Esc should close the dialog
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Reopen for tab test
    await user.click(screen.getByText('Open Dialog'));
    
    // Tab should cycle through focusable elements
    await user.tab();
    expect(screen.getByPlaceholderText('Test input')).toHaveFocus();
    
    await user.tab();
    expect(screen.getByText('Close')).toHaveFocus();
  });

  // Test multiple dialogs
  it('should handle multiple dialogs correctly', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Dialog>
          <DialogTrigger>Open First</DialogTrigger>
          <DialogContent>
            <DialogTitle>First Dialog</DialogTitle>
            <DialogDescription>First dialog description.</DialogDescription>
            <DialogClose>Close First</DialogClose>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>Open Second</DialogTrigger>
          <DialogContent>
            <DialogTitle>Second Dialog</DialogTitle>
            <DialogDescription>Second dialog description.</DialogDescription>
            <DialogClose>Close Second</DialogClose>
          </DialogContent>
        </Dialog>
      </>
    );

    // Open first dialog
    await user.click(screen.getByText('Open First'));
    expect(screen.getByText('First Dialog')).toBeInTheDocument();

    // Try to open second dialog (should close first)
    await user.click(screen.getByText('Open Second'));
    await waitFor(() => {
      expect(screen.queryByText('First Dialog')).not.toBeInTheDocument();
      expect(screen.getByText('Second Dialog')).toBeInTheDocument();
    });
  });

  // Test dynamic content updates
  it('should handle dynamic content updates', async () => {
    const TestDialog = () => {
      const [content, setContent] = React.useState('Initial content');
      return (
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dynamic Dialog</DialogTitle>
            <DialogDescription>Dialog with changing content.</DialogDescription>
            <div>{content}</div>
            <button onClick={() => setContent('Updated content')}>Update</button>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>
      );
    };

    const user = userEvent.setup();
    render(<TestDialog />);

    // Open dialog and verify initial content
    await user.click(screen.getByText('Open Dialog'));
    expect(screen.getByText('Initial content')).toBeInTheDocument();

    // Update content
    await user.click(screen.getByText('Update'));
    expect(screen.getByText('Updated content')).toBeInTheDocument();
  });

  // Test focus management
  it('should manage focus correctly', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Focus Test</DialogTitle>
          <DialogDescription>Testing focus management.</DialogDescription>
          <input placeholder="First input" />
          <input placeholder="Second input" />
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>
    );

    // Store initial trigger button reference
    const triggerButton = screen.getByText('Open Dialog');
    triggerButton.focus();
    expect(triggerButton).toHaveFocus();

    // Open dialog - first focusable element should get focus
    await user.click(triggerButton);
    expect(screen.getByPlaceholderText('First input')).toHaveFocus();

    // Close dialog - focus should return to trigger
    await user.click(screen.getByText('Close'));
    await waitFor(() => {
      expect(triggerButton).toHaveFocus();
    });
  });

  // Test error boundaries
  it('should handle errors gracefully', async () => {
    const ErrorDialog = () => {
      const [shouldError, setShouldError] = React.useState(false);
      if (shouldError) throw new Error('Test error');
      
      return (
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Error Test</DialogTitle>
            <DialogDescription>Testing error handling.</DialogDescription>
            <button onClick={() => setShouldError(true)}>Trigger Error</button>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>
      );
    };

    const consoleError = console.error;
    console.error = jest.fn();

    const user = userEvent.setup();
    render(
      <ErrorDialog />,
      { 
        wrapper: ({ children }) => (
          <React.StrictMode>
            {children}
          </React.StrictMode>
        )
      }
    );

    // Open dialog
    await user.click(screen.getByText('Open Dialog'));
    
    // Trigger error
    await user.click(screen.getByText('Trigger Error'));
    
    // Verify error was caught
    expect(console.error).toHaveBeenCalled();
    
    // Restore console.error
    console.error = consoleError;
  });

  // Test async content loading
  it('should handle async content loading', async () => {
    const AsyncDialog = () => {
      const [isLoading, setIsLoading] = React.useState(true);
      const [data, setData] = React.useState(null);

      React.useEffect(() => {
        const timer = setTimeout(() => {
          setData('Loaded content');
          setIsLoading(false);
        }, 100);
        return () => clearTimeout(timer);
      }, []);

      return (
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Async Dialog</DialogTitle>
            <DialogDescription>Testing async content loading.</DialogDescription>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div>{data}</div>
            )}
          </DialogContent>
        </Dialog>
      );
    };

    const user = userEvent.setup();
    render(<AsyncDialog />);

    // Open dialog
    await user.click(screen.getByText('Open Dialog'));
    
    // Initially should show loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText('Loaded content')).toBeInTheDocument();
    });
  });
});