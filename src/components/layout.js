import React from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";

import { theme } from "./styled/theme";
import { innerWidthSpacing } from "./styled/spacing";

import { Background } from "./Background/index";

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle></GlobalStyle>
      <StyledLayout>
        <Background />
        <Inner>
          <h1>Hey there!</h1>
          <p>
            My name is Fabian Tjoe-A-On, I'm a Javascript based developer from
            Rotterdam, The Netherlands.
          </p>
        </Inner>
      </StyledLayout>
    </ThemeProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #000;
    font-family: "Inter Regular", sans-serif;
    color: #fff;
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
  h1 {
    text-transform: uppercase;
    font-weight: 900;
    font-family: "Inter Black Italic", sans-serif;
    font-size: 5em;
    width: 75%;
    height: 75%;
  }

  p {
    font-family: "Inter Light", sans-serif;
    font-size: 1.6em;
  }
`;

export default Layout;
