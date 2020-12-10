export const widthMap = {
  xl: 2400,
  lg: 1720,
  mdPlus: 1380,
  mdMed: 1260,
  mdMin: 1100,
  md: 996,
  mdMin: 768,
  smPlus: 600,
  sm: 480,
};

export const mobileBreakpoint = widthMap.md;

export const breakpoints = {
  xl: `@media all and (min-width: ${widthMap.xl}px)`,
  lg: `@media all and (max-width: ${widthMap.lg}px)`,
  mdPlus: `@media all and (max-width: ${widthMap.mdPlus}px)`,
  mdMed: `@media all and (max-width: ${widthMap.mdMed}px)`,
  mdMin: `@media all and (max-width: ${widthMap.mdMin}px)`,
  md: `@media all and (max-width: ${widthMap.md}px)`,
  mdMin: `@media all and (max-width: ${widthMap.mdMin}px)`,
  smPlus: `@media all and (max-width: ${widthMap.smPlus}px)`,
  sm: `@media all and (max-width: ${widthMap.sm}px)`,
  mobileDevices: `@media all and (max-width: ${mobileBreakpoint}px)`,
};

export const targetIE11AndLower = `@media all and (-ms-high-contrast: none), (-ms-high-contrast: active)`;
