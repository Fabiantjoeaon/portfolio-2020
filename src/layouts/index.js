import React, { cloneElement, useRef, useState, useEffect } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import { TransitionProvider, TransitionViews } from "gatsby-plugin-transitions";
import { Canvas, useThree } from "react-three-fiber";
import { useTransition, animated as a } from "react-spring";
import { navigate } from "@reach/router";

import { AnimatedCharacters } from "../components/AnimatedText";

import Header from "../components/header";

import { theme } from "../components/styled/theme";
import { Background } from "../components/Background/index";
import { breakpoints } from "../components/styled/media";
import { EffectComposer, Noise } from "react-postprocessing";
import { sleep } from "../utils";
import { useFluidValue, useWindowSize } from "../hooks";

const Layout = ({ location, children, path }) => {
  // const data = useStaticQuery(graphql`
  //   query SiteTitleQuery {
  //     site {
  //       siteMetadata {
  //         title
  //       }
  //     }
  //   }
  // `);

  //TODO: also layout transition betwene intro and wrapper
  const initializeRef = useRef(false);
  //TEMP:
  const [loadingDone, setLoadingDone] = useState(false);
  const { height } = useWindowSize();

  const transitionProps = {
    mode: "successive",
    enter: {
      opacity: 0,
      transform: "translate3d(0,0px,0)",

      onRest: () => {},
    },
    usual: {
      opacity: 1,
      transform: "translate3d(0px,0px,0px)",
    },
    leave: {
      opacity: 0,
      transform: "translate3d(0px,0px,0px)",
    },
    config: {
      mass: 1,
      tension: 210,
      friction: 20,
      clamp: true,
    },
    location,
  };

  useEffect(() => {
    // navigate("/");
    setTimeout(() => {
      initializeRef.current = true;
    }, theme.initialLoadingTime);
  }, []);

  const lineTrans = useTransition(
    initializeRef.current,
    null,
    {
      from: { scaleX: 0, transformOrigin: "right" },
      enter: () => async next => {
        await sleep(400);
        while (!initializeRef.current) {
          await next({ scaleX: 1, transformOrigin: "left" });
          await next({ scaleX: 0, transformOrigin: "right" });
        }
      },
      leave: {
        scaleX: 0,
        transformOrigin: "right",
      },
      onRest: () => {
        setLoadingDone(true);
      },
      // delay: toggle ? options.delay : 0,
    },
    [initializeRef.current]
  );

  return (
    <ThemeProvider theme={theme}>
      {/* <PostProcessingCanvas /> */}
      <GlobalStyle></GlobalStyle>

      <Intro height={height} loadingDone={loadingDone}>
        <div className="loader">
          <AnimatedCharacters
            TextComponent={a.h1}
            text={"Loading"}
            toggle={!loadingDone}
            delay={400}
            animateFromOverflow={false}
          ></AnimatedCharacters>
          {lineTrans.map(
            ({ item, key, props: { transformOrigin, scaleX } }) =>
              !item && (
                <LoaderLine
                  key={key}
                  style={{
                    transformOrigin,
                    transform: scaleX.interpolate(x => `scaleX(${x})`),
                  }}
                />
              )
          )}
        </div>
      </Intro>
      <Wrapper>
        <StyledLayout>
          <Header path={path} loadingDone={loadingDone}></Header>
          <Background loadingDone={loadingDone} path={path} />

          <TransitionProvider {...transitionProps}>
            <TransitionViews>
              {cloneElement(children, {
                loadingDone,
              })}
            </TransitionViews>
          </TransitionProvider>
        </StyledLayout>
      </Wrapper>
    </ThemeProvider>
  );
};

function PostProcessing() {
  const { gl } = useThree();
  gl.setClearColor("#fff");
  gl.setClearAlpha(0.005);
  return (
    <>
      <EffectComposer>
        <Noise opacity={0.025} />
      </EffectComposer>
    </>
  );
}

function PostProcessingCanvas() {
  return (
    <StyledCanvas>
      <PostProcessing />
    </StyledCanvas>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

const StyledCanvas = styled(Canvas)`
  pointer-events: none;
  position: fixed !important;
  top: 0;

  left: 0;
  z-index: 5;
  width: 100vw;
  height: 100vh;
`;

const Wrapper = styled.div``;

const GlobalStyle = createGlobalStyle`
  html, body{
    margin: 0;
    padding: 0;
    overflow: hidden;
    /* -webkit-font-smoothing: antialiased; */
     /* -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility; */
  }

  html {
    font-size: 16px;
    ${breakpoints.mdPlus} {
      font-size: 14px;
    }
    ${breakpoints.md} {
      font-size: 12px;
    }
    ${breakpoints.sm} {
      font-size: 10px;
    }
  }
  body {
    background-color: #1F1F1F;
    font-family: "Modernist Regular", sans-serif;
    color: #fff;
    
  }

  h1 {
    /* text-transform: uppercase; */
    letter-spacing: 0px;
    font-weight: 900;
    
    font-family: "Modernist Bold", sans-serif;
    font-size: 6em;


    /* ${breakpoints.mdPlus} {
      font-size: 4.5em;
    } */
  }

  h2 {
    font-family: "Modernist Bold", sans-serif;
    font-size: 6em;
  }

  p {
    font-family: "Modernist Regular", sans-serif;
    font-size: 1.6em;
    letter-spacing: 1px;
    line-height: 1.7em;
  }
`;

const StyledLayout = styled.div`
  width: 100%;
  position: relative;
  /* min-height: 2000px; */
  z-index: 0;
`;

const Intro = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: ${({ height }) => height}px;
  z-index: 3;

  background-color: #333333;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${({ loadingDone }) => (loadingDone ? "0" : "1")};
  transition: opacity 0.3s 1s ${({ theme }) => theme.easing1};
  pointer-events: none;

  .loader {
    h1 {
      color: #242424;
      font-size: 19em !important;
      font-family: "Modernist Bold", sans-serif;
    }

    ${breakpoints.mobileDevices} {
      font-size: 0.4em !important;
      letter-spacing: 0px;
    }
  }
`;

const LoaderLine = styled(a.span)`
  position: absolute;
  top: 85%;
  left: calc(50% - 35vw);
  /* background: rgb(255, 153, 102); */

  background: ${({ theme }) => `linear-gradient(
    90deg,
    #242424 0%,
    #242424 100%
  )`};
  transform-origin: left;
  transform: scaleX(0);
  width: 70vw;
  height: 3px;

  ${breakpoints.mobileDevices} {
    top: 65%;
  }
`;

export default Layout;
