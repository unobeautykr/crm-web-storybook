import { useEffect, useRef } from 'react';

function isDepChanged(lastDeps, deps) {
  if (!lastDeps) return true;

  for (let i = 0; i < lastDeps.length; i++) {
    if (lastDeps[i] !== deps[i]) return true;
  }

  return false;
}

export const useReaction = (func, deps) => {
  const lastDeps = useRef();
  const cleanup = useRef();

  if (isDepChanged(lastDeps.current, deps)) {
    lastDeps.current = deps;
    cleanup.current?.();
    cleanup.current = func();
  }

  useEffect(() => {
    return () => {
      cleanup.current?.();
      cleanup.current = null;
    };
  }, []);
};
