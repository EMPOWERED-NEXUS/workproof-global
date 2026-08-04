import { useCallback, useEffect, useState } from 'react';

export function useQueryState() {
  const read = useCallback(() => new URLSearchParams(window.location.search), []);
  const [params, setParams] = useState(read);

  useEffect(() => {
    function onPop() {
      setParams(read());
    }
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [read]);

  function update(next: Record<string, string | undefined>) {
    const sp = new URLSearchParams(window.location.search);
    for (const [k, v] of Object.entries(next)) {
      if (!v) sp.delete(k);
      else sp.set(k, v);
    }
    const qs = sp.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ''}`;
    window.history.replaceState(null, '', url);
    setParams(new URLSearchParams(sp));
  }

  return { params, update };
}
