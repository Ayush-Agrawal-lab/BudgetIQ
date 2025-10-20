import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { initializeRRWeb, initializeErrorTracking } from './services/rrweb-service';

// Initialize rrweb recording
initializeRRWeb();

// Initialize error tracking
initializeErrorTracking();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
