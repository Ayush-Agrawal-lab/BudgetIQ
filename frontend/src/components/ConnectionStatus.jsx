import React, { useEffect, useState } from 'react';
import api from '../services/api';

export function ConnectionStatus() {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await api.get('/health');
        if (response.data.status === 'healthy') {
          setStatus('connected');
          setError(null);
        } else {
          throw new Error('Unhealthy backend status');
        }
      } catch (err) {
        setStatus('error');
        setError(err.message);
        console.error('Backend connection error:', err);
      }
    };

    checkConnection();
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (status === 'error') {
    return (
      <div className="connection-error">
        <p>Connection Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return null;
}

export default ConnectionStatus;