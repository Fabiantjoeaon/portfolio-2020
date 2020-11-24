import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import { animated as a } from "react-spring";

import Image from "../components/image";

import SEO from "../components/seo";
import { useRouteActive } from "../hooks";

import { Inner } from "../components/styled/Inner";
import {
  AnimatedCharacters,
  AnimatedParagraph,
  AnimatedText,
} from "../components/AnimatedText";

const IndexPage = props => {
  const isActive = useRouteActive(props.path, "/");

  return (
    <Inner>
      <StyledIndex>
        <SEO title="Home" />
        <AnimatedTextWrapper>
          <AnimatedCharacters
            text={"Fabian"}
            delay={2000}
            TextComponent={a.h1}
            toggle={isActive}
            containerStyle={{
              marginRight: "50px",
            }}
          ></AnimatedCharacters>
          <AnimatedCharacters
            text={"Tjoeaon"}
            delay={2500}
            TextComponent={a.h1}
            toggle={isActive}
          ></AnimatedCharacters>
        </AnimatedTextWrapper>
        <AnimatedParagraph
          items={["Creative", "developer"]}
          toggle={isActive}
          delay={3000}
          align={"right"}
          options={{ height: 80, spacing: 2 }}
          containerStyle={{ textAlign: "right" }}
          TextComponent={a.h2}
        ></AnimatedParagraph>

        <Button>
          <Link to="/work">View my work</Link>
        </Button>
      </StyledIndex>
    </Inner>
  );
};

const AnimatedTextWrapper = styled.div`
  display: flex;
  /* justify-content: space-between; */
  align-self: flex-start;

  width: 100%;

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
      margin: 0px;
      font-size: 4em;
      font-family: "Modernist Bold", sans-serif;
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
