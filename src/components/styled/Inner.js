import React from "react";
import styled from "styled-components";
import { innerWidthSpacing } from "./spacing";
import { useWindowSize } from "../../hooks";

export const Inner = styled.div`
  ${innerWidthSpacing};

  display: flex;
  /* align-items: center; */
  justify-content: center;
  flex-flow: column nowrap;
`;

//
export const FullHeightInner = ({ children }) => {
  const { height } = useWindowSize();

  return <Inner style={{ height: `${height}px` }}>{children}</Inner>;
};
