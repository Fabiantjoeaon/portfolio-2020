import React from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import { TransitionProvider, TransitionViews } from "gatsby-plugin-transitions";

import { theme } from "../components/styled/theme";
import { innerWidthSpacing } from "../components/styled/spacing";
import { Background } from "../components/Background/index";

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

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle></GlobalStyle>
      <StyledLayout>
        <Background path={path} />
        <Inner>{children}</Inner>
      </StyledLayout>
    </ThemeProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #1F1F1F;
    font-family: "Modernist Regular", sans-serif;
    color: #fff;
    overflow-y: hidden;
  }
`;

const StyledLayout = styled.div`
  width: 100%;
  position: relative;
  /* min-height: 2000px; */
  z-index: 0;
`;

const Inner = styled.div`
  ${innerWidthSpacing};

  height: 100vh;

  display: flex;
  /* align-items: center; */
  justify-content: center;
  flex-flow: column nowrap;
  h1 {
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 900;
    margin: 0px 0px 180px;
    font-family: "Modernist Bold", sans-serif;
    font-size: 6em;

    /* text-align: center; */
    -webkit-text-fill-color: rgba(
      0,
      0,
      0,
      0
    ); /* Will override color (regardless of order) */
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: #fff;
  }

  h2 {
    /* -webkit-text-fill-color: rgba(
      0,
      0,
      0,
      0
    ); /* Will override color (regardless of order) */
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: #fff; */
    font-family: "Modernist Bold", sans-serif;
    align-self: flex-end;
    font-size: 6em;
  }

  p {
    font-family: "Modernist Regular", sans-serif;
    font-size: 1.6em;
    letter-spacing: 1px;
    line-height: 1.7em;
  }
`;

export default Layout;
