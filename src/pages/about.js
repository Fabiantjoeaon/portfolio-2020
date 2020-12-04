import React, { useMemo } from "react";
import { graphql, Link } from "gatsby";
import styled from "styled-components";
import { useTransition, animated as a } from "react-spring";
import { FullHeightInner } from "../components/styled/Inner";

import { useRouteActive } from "../hooks";
import { sleep } from "../utils";

export default function AboutPage() {
  return (
    <FullHeightInner>
      <h1>Hi there!</h1>
    </FullHeightInner>
  );
}
