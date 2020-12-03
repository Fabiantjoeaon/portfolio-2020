import React, { useEffect, memo } from "react";
import { useTransition, animated as a } from "react-spring";
import styled from "styled-components";

import { sleep } from "../utils";

export default function AnimatedLine({ toggle, delay, width = 150 }) {
  const transition = useTransition(
    toggle,
    null,
    {
      from: { scaleX: 0, transformOrigin: "right" },
      enter: () => async next => {
        await sleep(delay);
        await next({ scaleX: 1, transformOrigin: "left" });
        await next({ scaleX: 0, transformOrigin: "right" });
        await next({ scaleX: 1, transformOrigin: "left" });
      },
      leave: {
        scaleX: 0,
      },
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
