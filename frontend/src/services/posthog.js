import posthog from 'posthog-js';

// Disable PostHog in development
const isProduction = process.env.NODE_ENV === 'production';

// PostHog configuration with proper CORS settings
if (isProduction) {
  const key = process.env.REACT_APP_POSTHOG_KEY || '';
  // Initialize only when a valid key is provided (not the placeholder)
  if (key && key !== 'your-project-api-key-here') {
    posthog.init(key, {
      api_host: 'https://us.i.posthog.com',
      loaded: (posthog) => {
        // Add additional configuration if needed
        posthog.opt_in_capturing();
      },
      autocapture: false, // Disable autocapture to reduce CORS issues
      capture_pageview: false, // Disable automatic pageview capture
      persistence: 'memory', // Use memory persistence to avoid localStorage issues
      cross_subdomain_cookie: false // Disable cross-subdomain cookies
    });
  } else {
    // No-op PostHog object for production when no valid key provided
    window.posthog = {
      capture: () => {},
      identify: () => {},
      init: () => {},
      opt_in_capturing: () => {},
      register: () => {},
      register_once: () => {}
    };
  }
} else {
  // Mock PostHog in development
  window.posthog = {
    capture: () => {},
    identify: () => {},
    init: () => {},
    opt_in_capturing: () => {},
    register: () => {},
    register_once: () => {}
  };
}

export default posthog;