import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "../../lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props} />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  // Generate a unique ID for aria-describedby fallback
  const [descriptionId] = React.useState(() => `dialog-description-${Math.random().toString(36).substring(2, 9)}`);

  // Recursively walk children to find any DialogDescription and ensure it has an id.
  // Returns { found: boolean, id?: string, nodes: ReactNode }
  const findAndEnsureDescription = (nodes) => {
    let found = false;
    let foundId = undefined;

    const walker = (child) => {
      if (!React.isValidElement(child)) return child;

      // If this element is a DialogPrimitive.Description (or our DialogDescription), ensure it has an id
      const typeDisplayName = child.type?.displayName;
      const isDescription =
        child.type === DialogPrimitive.Description ||
        typeDisplayName === DialogPrimitive.Description.displayName ||
        typeDisplayName === DialogDescription.displayName;

      if (isDescription) {
        found = true;
        // use existing id or assign one
        const id = child.props.id ?? descriptionId;
        foundId = id;
        // clone element with id if missing
        if (!child.props.id) return React.cloneElement(child, { id });
        return child;
      }

      // If element has children, recurse into them
      if (child.props && child.props.children) {
        const newChildren = React.Children.map(child.props.children, walker);
        // If children changed, clone parent with new children
        if (newChildren !== child.props.children) {
          return React.cloneElement(child, undefined, newChildren);
        }
      }

      return child;
    };

    const processed = React.Children.map(nodes, walker);
    return { found, id: foundId, nodes: processed };
  };

  const { found: hasDescription, id: existingDescriptionId, nodes: processedChildren } = findAndEnsureDescription(children);

  const contentChildren = hasDescription ? processedChildren : (
    <>
      {processedChildren}
      <DialogDescription id={descriptionId} className="sr-only">
        Dialog content
      </DialogDescription>
    </>
  );

  const ariaDescribedBy = hasDescription ? (existingDescriptionId ?? undefined) : descriptionId;

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        {contentChildren}
        <DialogPrimitive.Close
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props} />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
