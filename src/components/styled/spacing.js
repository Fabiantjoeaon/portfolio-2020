import { css } from "styled-components";

import { breakpoints, targetIE11AndLower } from "./media";

export const innerWidthSpacing = css`
  margin: 0 auto;
  padding: 150px 0px;
  ${breakpoints.xl} {
    width: ${({ theme }) => theme.maxLayoutWidth.xl};
    max-width: ${({ theme }) => theme.maxLayoutWidth.xl};
  }

  ${breakpoints.lg} {
    width: ${({ theme }) => theme.maxLayoutWidth.lg};
    max-width: ${({ theme }) => theme.maxLayoutWidth.lg};
  }

  ${breakpoints.mdPlus} {
    width: ${({ theme }) => theme.maxLayoutWidth.mdPlus};
    max-width: ${({ theme }) => theme.maxLayoutWidth.mdPlus};
  }

  ${breakpoints.md} {
    width: ${({ theme }) => theme.maxLayoutWidth.sm};
    max-width: ${({ theme }) => theme.maxLayoutWidth.sm};
  }

  ${breakpoints.sm} {
    width: ${({ theme }) => theme.maxLayoutWidth.sm};
    max-width: ${({ theme }) => theme.maxLayoutWidth.sm};
  }

  ${targetIE11AndLower} {
    width: 100%;
    max-width: 100%;
  }
`;
