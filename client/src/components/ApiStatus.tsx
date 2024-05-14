import { useEffect, useState } from 'react';
import { statusCheck } from '../api/status';

export default function ApiStatus() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await statusCheck();
        setStatus(JSON.stringify(res));
      } catch (err) {
        setError(JSON.stringify(err));
      }
    };
    void checkStatus();
  }, []);

  const onPing = () => {
    statusCheck()
      .then((res) => setStatus(JSON.stringify(res)))
      .catch((err) => console.error(err));
  };

  const onFetch = () => {
    fetch('https://mint-invoicing-api.onrender.com/api/status')
      .then((res) => setStatus(JSON.stringify(res.json())))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <p>Fetching api/status:</p>
      <p>Response: {JSON.stringify(status)}</p>
      <p>Error: {error}</p>
      <button onClick={onPing}>Ping</button>
      <button onClick={onFetch}>Fetch</button>
    </div>
  );
}

