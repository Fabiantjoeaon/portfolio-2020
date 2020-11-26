import React, { useEffect, memo } from "react";
import { useTransition, animated as a } from "react-spring";
import styled from "styled-components";

export default function AnimatedLine({
  toggle,
  options = { delay: 1500 },
  width = 150,
}) {
  const transition = useTransition(
    toggle,
    null,
    {
      from: { scaleX: 0, transformOrigin: "right" },
      enter: [
        { scaleX: 1, transformOrigin: "left" },
        { scaleX: 0, transformOrigin: "right" },
        { scaleX: 1, transformOrigin: "left" },
      ],
      leave: {
        scaleX: 0,
      },
      delay: toggle ? options.delay : 0,
    },
    [toggle]
  );

  return transition.map(
    ({ item, key, props: { transformOrigin, scaleX } }) =>
      item && (
        <Line
          key={key}
          width={width}
          style={{
            transformOrigin,
            transform: scaleX.interpolate(x => `scaleX(${x})`),
          }}
        />
      )
  );
}

const Line = styled(a.span)`
  display: block;
  background-color: #242424;
  height: 1px;
  width: ${({ width }) => width}px;
`;
