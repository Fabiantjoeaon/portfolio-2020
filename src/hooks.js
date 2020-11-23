import { useCallback, useState, useEffect } from "react";

export function useWindowSize() {
  const isBrowser = typeof window !== "undefined";

  const getSize = useCallback(() => {
    const width = isBrowser ? window.innerWidth : 0;
    const height = isBrowser ? window.innerHeight : 0;

    return {
      width,
      height,
    };
  }, [isBrowser]);

  const [windowSize, setWindowSize] = useState(getSize());

  useEffect(() => {
    if (!isBrowser) return false;

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getSize, isBrowser]);

  return windowSize;
}
