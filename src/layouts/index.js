import React from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import { TransitionProvider, TransitionViews } from "gatsby-plugin-transitions";

import Header from "../components/header";
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
        <Header></Header>
        <Background path={path} />

        <TransitionProvider location={location}>
          <TransitionViews>{children}</TransitionViews>
        </TransitionProvider>
      </StyledLayout>
    </ThemeProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

const GlobalStyle = createGlobalStyle`
  html, body{
    margin: 0;
    padding: 0;
  }
  body {
    background-color: #1F1F1F;
    font-family: "Modernist Regular", sans-serif;
    color: #fff;
    overflow-y: hidden;
  }

  h1 {
    /* text-transform: uppercase; */
    letter-spacing: 0px;
    font-weight: 900;
    
    font-family: "Modernist Bold", sans-serif;
    font-size: 6em;

    
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

export default Layout;
