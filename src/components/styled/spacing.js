import { css } from "styled-components";

import { breakpoints, targetIE11AndLower } from "./media";
import { theme } from "./theme";

export const innerWidthSpacing = css`
  margin: 0 auto;

  width: 85%;

  ${generateWidthCSS(theme.maxInnerWidth, breakpoints)};

  ${targetIE11AndLower} {
    width: 100%;
    max-width: 100%;
  }
`;

export const outerWidthSpacing = css`
  margin: 0 auto;

  ${generateWidthCSS(theme.maxOuterWidth, breakpoints)};

  ${targetIE11AndLower} {
    width: 100%;
    max-width: 100%;
  }
`;

function generateWidthCSS(widthMap, breakpoints) {
  let css = ``;
  for (const [key, value] of Object.entries(widthMap)) {
    css += `
      ${breakpoints[key]} {
        width: ${value};
        max-width: ${value};
      }
    `;
  }

  return css;
}
