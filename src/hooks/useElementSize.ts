import { useCallback, useLayoutEffect, useRef, useState } from 'react';

export function useElementSize(): any {
  const [element, setElement] = useState();
  const [rect, setRect] = useState<any>();
  const observerRef = useRef(
    new ResizeObserver((entries) => {
      const entry = entries[0];
      // prevent triggering synchronous rerender.
      setTimeout(() => {
        setRect(entry.target.getBoundingClientRect());
      });
    })
  );

  useLayoutEffect(() => {
    if (!element) return;

    const observer = observerRef.current;
    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [element]);

  const ref = useCallback((node: any) => {
    setElement(node);
  }, []);

  return [rect, ref];
}
