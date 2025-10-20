import posthog from 'posthog-js';

// Disable PostHog in development
const isProduction = process.env.NODE_ENV === 'production';

// PostHog configuration with proper CORS settings
if (isProduction) {
  posthog.init(process.env.REACT_APP_POSTHOG_KEY || 'your-project-api-key-here', {
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