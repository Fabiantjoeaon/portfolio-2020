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
  const isBrowser = typeof window !== "undefined";

  if (!isBrowser) return null;

  const initializeRef = useRef(false);
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
    navigate("/");
    setTimeout(() => {
      initializeRef.current = true;
    }, theme.initialLoadingTime);
  }, []);

  const introTrans = useTransition(
    loadingDone,
    null,
    {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
    },
    [loadingDone]
  );

  const lineTrans = useTransition(
    initializeRef.current,
    null,
    {
      from: { scaleX: 0, transformOrigin: "right" },
      enter: () => async next => {
        await sleep(2000);
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
      <Wrapper>
        {introTrans.map(({ item, key, props: { opacity } }) => {
          return item ? (
            <StyledLayout key={key} style={{ opacity }}>
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
          ) : (
            <Intro
              key={key}
              style={{ opacity }}
              height={height !== 0 ? height : window.innerHeight}
            >
              <div className="loader">
                <AnimatedCharacters
                  TextComponent={a.h1}
                  text={"Loading"}
                  toggle={!loadingDone}
                  delay={2000}
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
          );
        })}
      </Wrapper>
    </ThemeProvider>
  );
};

function PostProcessing() {
  const { gl } = useThree();
  gl.setClearColor("#fff");
  gl.setClearAlpha(0.002);
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

const Wrapper = styled.div`
  overflow: hidden;
  /* max-height: 100vh; */
`;

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
    background-color: #333333;
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

const StyledLayout = styled(a.div)`
  width: 100%;
  position: relative;

  z-index: 0;
`;

const Intro = styled(a.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  /* height: ${({ height }) => height}px; */
  height: 100vh;
  z-index: 3;

  background-color: #333333;
  display: flex;
  justify-content: center;
  align-items: center;
  /* opacity: ${({ loadingDone }) => (loadingDone ? "0" : "1")}; */
  transition: opacity 0.3s 1s ${({ theme }) => theme.easing1};
  pointer-events: none;
  opacity: 1;
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
