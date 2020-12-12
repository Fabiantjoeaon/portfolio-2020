import React, { useMemo, useEffect } from "react";
import styled from "styled-components";
import { useTransition, animated as a } from "react-spring";
import { FullHeightInner } from "../components/styled/Inner";

import { useRouteActive } from "../hooks";
import { sleep } from "../utils";
import { useStore } from "../BackgroundColorStore";

export default function AboutPage({ path }) {
  const setColor = useStore(state => state.setColor);
  const isActive = useRouteActive(path, "/about/");
  useEffect(() => {
    if (isActive) setColor("about");
  }, [isActive]);

  return (
    <FullHeightInner>
      <h1>Hi there!</h1>
    </FullHeightInner>
  );
}
