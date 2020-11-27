import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import { animated as a } from "react-spring";

import Image from "../components/image";

import SEO from "../components/seo";
import { useRouteActive } from "../hooks";

import { FullHeightInner } from "../components/styled/Inner";
import { theme } from "../components/styled/theme";
import {
  AnimatedCharacters,
  AnimatedParagraph,
  AnimatedText,
} from "../components/AnimatedText";

const IndexPage = ({ path, loadingDone }) => {
  const isActive = useRouteActive(path, "/");

  return (
    <FullHeightInner>
      <StyledIndex>
        <SEO title="Home" />
        <AnimatedTextWrapper>
          <AnimatedCharacters
            text={"Form follows function"}
            delay={loadingDone ? 2000 : theme.initialLoadingTime + 2000 + 2000}
            TextComponent={a.h1}
            toggle={isActive}
            options={{ align: "left" }}
            wordDelay={1000}
          ></AnimatedCharacters>
        </AnimatedTextWrapper>
        <AnimatedParagraph
          items={["Creative developer", "from Rotterdam"]}
          toggle={isActive}
          delay={loadingDone ? 3500 : theme.initialLoadingTime + 3500 + 2000}
          options={{ height: 80, spacing: 2 }}
          containerStyle={{ textAlign: "right" }}
          TextComponent={a.h2}
        ></AnimatedParagraph>

        {/* <Button>
          <Link to="/projects">View my work</Link>
        </Button> */}
      </StyledIndex>
    </FullHeightInner>
  );
};

const AnimatedTextWrapper = styled.div`
  /* display: flex;
  /* justify-content: space-between; */
  /* align-self: flex-start;  */

  width: 100%;

  h1 {
    font-family: "Modernist Bold", sans-serif;
    /* text-transform: uppercase; */
    margin: 0px 0px 180px;
    /* -webkit-text-fill-color: rgba(0, 0, 0, 0);

    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: #fff; */
  }
  .name-first {
    margin-right: 40px;
  }
`;

const StyledIndex = styled.div`
  display: flex;
  height: 65%;
  flex-flow: column nowrap;
  justify-content: space-between;

  .animated-paragraph {
    align-self: flex-end;
    h2 {
      letter-spacing: 1px;
      margin: 0px;
      font-weight: 100;
      font-size: 4em;
      font-family: "Castoro Italic", sans-serif;
    }
  }
`;

const Button = styled.button`
  border: 1px solid white;
  padding: 15px 20px;
  background-color: rgba(0, 0, 0, 0);
  margin: 30px 0px;
  display: inline-block;
  align-self: flex-end;
  a {
    font-size: 1.4em;
    color: #fff;
    text-decoration: none;
    &::visited {
      color: #fff;
    }
  }
`;

export default IndexPage;
