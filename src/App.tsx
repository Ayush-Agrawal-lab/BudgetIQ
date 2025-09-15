import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CurrencyProvider } from './components/CurrencyContext';
import { LocationProvider } from './components/LocationContext';

// Lazy load components for better performance
const SimpleDashboard = lazy(() => import('./components/SimpleDashboardOptimized').then(module => ({ default: module.SimpleDashboard })));
const LandingPage = lazy(() => import('./components/LandingPage').then(module => ({ default: module.LandingPage })));
const AuthPage = lazy(() => import('./components/AuthPage').then(module => ({ default: module.AuthPage })));
const AddTransactionEnhanced = lazy(() => import('./components/AddTransactionEnhanced').then(module => ({ default: module.AddTransactionEnhanced })));
const TransactionHistory = lazy(() => import('./components/TransactionHistory').then(module => ({ default: module.TransactionHistory })));
const AccountsManager = lazy(() => import('./components/AccountsManager').then(module => ({ default: module.AccountsManager })));
const SimpleInsightsEnhanced = lazy(() => import('./components/SimpleInsightsEnhanced').then(module => ({ default: module.SimpleInsightsEnhanced })));
const SettingsPage = lazy(() => import('./components/SettingsPage').then(module => ({ default: module.SettingsPage })));
const Sidebar = lazy(() => import('./components/Sidebar').then(module => ({ default: module.Sidebar })));
const Header = lazy(() => import('./components/Header').then(module => ({ default: module.Header })));

// Loading component for suspense
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [isLoading, setIsLoading] = useState(true);

  // Initialize state from storage after component mounts
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Add timeout to prevent hanging
        const timeoutId = setTimeout(() => {
          console.warn('App initialization taking too long, proceeding with defaults');
          setIsLoading(false);
        }, 5000);

        const savedAuth = sessionStorage.getItem('budgetiq-auth');
        if (savedAuth) {
          try {
            setIsAuthenticated(JSON.parse(savedAuth));
            setCurrentPage('dashboard'); // Start at dashboard if authenticated
          } catch (error) {
            console.warn('Failed to parse auth state from sessionStorage:', error);
            sessionStorage.removeItem('budgetiq-auth');
          }
        }

        const savedTheme = localStorage.getItem('budgetiq-dark-mode');
        if (savedTheme) {
          try {
            setIsDarkMode(JSON.parse(savedTheme));
          } catch (error) {
            console.warn('Failed to parse theme from localStorage:', error);
            localStorage.removeItem('budgetiq-dark-mode');
            setIsDarkMode(true); // Default to dark if parsing fails
          }
        }

        clearTimeout(timeoutId);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    try {
      localStorage.setItem('budgetiq-dark-mode', JSON.stringify(newMode));
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
    try {
      sessionStorage.setItem('budgetiq-auth', JSON.stringify(true));
    } catch (error) {
      console.warn('Failed to save auth state to sessionStorage:', error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('landing');
    try {
      sessionStorage.removeItem('budgetiq-auth');
    } catch (error) {
      console.warn('Failed to remove auth state from sessionStorage:', error);
    }
  };

  const renderPage = () => {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        {(() => {
          switch (currentPage) {
            case 'landing':
              return <LandingPage onNavigate={setCurrentPage} />;
            case 'auth':
              return <AuthPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
            case 'dashboard':
              return <SimpleDashboard />;
            case 'add-transaction':
              return <AddTransactionEnhanced />;
            case 'transactions':
              return <TransactionHistory />;
            case 'accounts':
              return <AccountsManager />;
            case 'insights':
              return <SimpleInsightsEnhanced />;
            case 'settings':
              return <SettingsPage isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />;
            default:
              return <SimpleDashboard />;
          }
        })()}
      </Suspense>
    );
  };

  // Show loading spinner while initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading BudgetIQ...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && currentPage !== 'landing' && currentPage !== 'auth') {
    return <LandingPage onNavigate={setCurrentPage} />;
  }

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <CurrencyProvider>
          <LocationProvider>
            {renderPage()}
          </LocationProvider>
        </CurrencyProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <CurrencyProvider>
        <LocationProvider>
          <div className="flex h-screen bg-background">
            <Suspense fallback={<LoadingSpinner />}>
              <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
            </Suspense>
            <div className="flex-1 flex flex-col overflow-hidden">
              <Suspense fallback={<LoadingSpinner />}>
                <Header 
                  isDarkMode={isDarkMode} 
                  onToggleTheme={toggleTheme} 
                  onLogout={handleLogout}
                  onNavigate={setCurrentPage}
                />
              </Suspense>
              <main className="flex-1 overflow-y-auto" role="main" aria-label="Main content">
                <ErrorBoundary>
                  {renderPage()}
                </ErrorBoundary>
              </main>
            </div>
          </div>
        </LocationProvider>
      </CurrencyProvider>
    </ErrorBoundary>
  );
}