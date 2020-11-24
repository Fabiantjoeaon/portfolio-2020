import { css } from "styled-components";

import { breakpoints, targetIE11AndLower } from "./media";

export const innerWidthSpacing = css`
  margin: 0 auto;

  ${breakpoints.xl} {
    width: ${({ theme }) => theme.maxInnerWidth.xl};
    max-width: ${({ theme }) => theme.maxInnerWidth.xl};
  }

  ${breakpoints.lg} {
    width: ${({ theme }) => theme.maxInnerWidth.lg};
    max-width: ${({ theme }) => theme.maxInnerWidth.lg};
  }

  ${breakpoints.mdPlus} {
    width: ${({ theme }) => theme.maxInnerWidth.mdPlus};
    max-width: ${({ theme }) => theme.maxInnerWidth.mdPlus};
  }

  ${breakpoints.md} {
    width: ${({ theme }) => theme.maxInnerWidth.sm};
    max-width: ${({ theme }) => theme.maxInnerWidth.sm};
  }

  ${breakpoints.sm} {
    width: ${({ theme }) => theme.maxInnerWidth.sm};
    max-width: ${({ theme }) => theme.maxInnerWidth.sm};
  }

  ${targetIE11AndLower} {
    width: 100%;
    max-width: 100%;
  }
`;

export const outerWidthSpacing = css`
  margin: 0 auto;

  ${breakpoints.xl} {
    width: ${({ theme }) => theme.maxOuterWidth.xl};
    max-width: ${({ theme }) => theme.maxOuterWidth.xl};
  }

  ${breakpoints.lg} {
    width: ${({ theme }) => theme.maxOuterWidth.lg};
    max-width: ${({ theme }) => theme.maxOuterWidth.lg};
  }

  ${breakpoints.mdPlus} {
    width: ${({ theme }) => theme.maxOuterWidth.mdPlus};
    max-width: ${({ theme }) => theme.maxOuterWidth.mdPlus};
  }

  ${breakpoints.md} {
    width: ${({ theme }) => theme.maxOuterWidth.sm};
    max-width: ${({ theme }) => theme.maxOuterWidth.sm};
  }

  ${breakpoints.sm} {
    width: ${({ theme }) => theme.maxOuterWidth.sm};
    max-width: ${({ theme }) => theme.maxOuterWidth.sm};
  }

  ${targetIE11AndLower} {
    width: 100%;
    max-width: 100%;
  }
`;
