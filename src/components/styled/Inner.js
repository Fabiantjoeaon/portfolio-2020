import styled from "styled-components";
import { innerWidthSpacing } from "./spacing";

export const Inner = styled.div`
  ${innerWidthSpacing};

  height: 100vh;

  display: flex;
  /* align-items: center; */
  justify-content: center;
  flex-flow: column nowrap;
`;
