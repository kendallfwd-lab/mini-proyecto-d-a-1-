import { useCallback, useEffect, useState } from 'react';

export default function useResource(loader, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    loader()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [...dependencies, reloadKey]);

  return { data, setData, loading, error, setError, reload };
}
