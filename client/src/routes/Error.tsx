import { useRouteError } from 'react-router-dom';

export default function Error() {
  const error = useRouteError();

  return (
    <div>
      <h2>Error</h2>
      <p>{error.statusText || error.nessage}</p>
    </div>
  );
}
