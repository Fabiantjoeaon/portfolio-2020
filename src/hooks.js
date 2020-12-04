import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import { clamp } from "./utils";
import { theme } from "./components/styled/theme";
import { widthMap } from "./components/styled/media";

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

export function useRouteActive(path, matchRoute, search = false) {
  const [active, set] = useState(path === matchRoute);
  useEffect(() => {
    set(search ? path.includes(matchRoute) : path === matchRoute);
  }, [path]);

  return active;
}

export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export function useFluidValue(
  windowWidth,
  minValue,
  maxValue,
  minScreenWidth = widthMap.sm,
  maxScreenWidth = widthMap.lg
) {
  return useMemo(() => {
    const valueDiff = maxValue - minValue;
    const screenWidthDiff = maxScreenWidth - minScreenWidth;

    return clamp(
      minValue + valueDiff * ((windowWidth - minScreenWidth) / screenWidthDiff),
      minValue,
      maxValue
    );
  }, [windowWidth]);
}
