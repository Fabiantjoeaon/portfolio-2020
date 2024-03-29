import React, { useLayoutEffect, useState, useEffect } from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import { animated as a } from "react-spring";

import SEO from "../components/seo";
import { useRouteActive } from "../hooks";

import { FullHeightInner } from "../components/styled/Inner";
import { theme } from "../components/styled/theme";
import { breakpoints, mobileBreakpoint } from "../components/styled/media";
import {
  AnimatedCharacters,
  AnimatedParagraph,
} from "../components/AnimatedText";
import { useStore } from "../BackgroundColorStore";
import { useWindowSize } from "../hooks";

const IndexPage = ({ path, loadingDone }) => {
  const isBrowser = typeof window !== "undefined";

  if (!isBrowser) return null;

  const isActive = useRouteActive(path, "/");
  const { width, height } = useWindowSize();
  const setColor = useStore(state => state.setColor);

  useLayoutEffect(() => {
    isActive && setColor("default");
  }, [isActive]);

  return (
    <FullHeightInner>
      <StyledIndex>
        <SEO title="Home" />
        <AnimatedTextWrapper>
          <AnimatedCharacters
            text={"Digital portfolio"}
            delay={loadingDone ? 2000 : theme.initialLoadingTime + 2000 + 2000}
            TextComponent={a.h1}
            toggle={isActive}
            wordDelay={1000}
            breakConditions={{
              width: mobileBreakpoint,
            }}
          ></AnimatedCharacters>
        </AnimatedTextWrapper>
        <AnimatedParagraph
          items={["Creative developer", "from Rotterdam"]}
          toggle={isActive}
          delay={loadingDone ? 3000 : theme.initialLoadingTime + 3000 + 2000}
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

    margin: 0px;
  }
  .name-first {
    margin-right: 40px;
  }

  ${breakpoints.mdPlus} {
    h1 {
      font-size: 4.8em;
    }
    .animated-paragraph {
      h2 {
        font-size: 2.5em;
      }
    }
  }
  ${breakpoints.mobileDevices} {
    h1 {
      letter-spacing: 0px;
      font-size: 5em;
      font-family: "Modernist Bold", sans-serif;
    }

    h2 {
      font-family: "Castoro Italic", serif;
    }
  }
`;

const StyledIndex = styled.div`
  display: flex;
  height: 65%;
  flex-flow: column nowrap;
  justify-content: space-between;

  margin: 0 auto;
  width: 85%;

  .animated-paragraph {
    align-self: flex-end;
    h2 {
      letter-spacing: 1px;
      margin: 0px;
      font-weight: 100;
      font-size: 3em;
      font-family: "Castoro Italic", sans-serif;
    }
  }

  ${breakpoints.mobileDevices} {
    margin-top: 30px;
    width: 80%;
    height: 75%;
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
