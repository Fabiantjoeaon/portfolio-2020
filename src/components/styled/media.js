export const widthMap = {
  lg: 1600,
  mdPlus: 1280,
  md: 996,
  mdMin: 768,
  sm: 480,
};

export const mobileBreakpoint = widthMap.md;

export const breakpoints = {
  xl: `@media all and (min-width: ${widthMap.lg}px)`,
  lg: `@media all and (max-width: ${widthMap.lg}px)`,
  mdPlus: `@media all and (max-width: ${widthMap.mdPlus}px)`,
  md: `@media all and (max-width: ${widthMap.md}px)`,
  mdMin: `@media all and (max-width: ${widthMap.mdMin}px)`,
  sm: `@media all and (max-width: ${widthMap.sm}px)`,
  mobileDevices: `@media all and (max-width: ${mobileBreakpoint}px)`,
};

export const targetIE11AndLower = `@media all and (-ms-high-contrast: none), (-ms-high-contrast: active)`;
