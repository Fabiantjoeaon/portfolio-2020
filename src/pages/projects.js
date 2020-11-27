import React, { useMemo } from "react";
import { graphql, Link } from "gatsby";
import styled from "styled-components";
import { useTransition, animated as a } from "react-spring";
import { FullHeightInner } from "../components/styled/Inner";

import { useRouteActive } from "../hooks";
import { sleep } from "../utils";
import { AnimatedCharacters } from "../components/AnimatedText";

// https://www.clockstrikestwelve.com/
// mix-blend-mode: difference;
export default function ProjectPage({
  path,
  data: {
    allMarkdownRemark: { edges: pages },
  },
}) {
  const isActive = useRouteActive(path, "/projects/");
  const items = useMemo(() => (isActive ? pages : []), [isActive]);
  const transition = useTransition(items, item => item.node.frontmatter.slug, {
    from: {
      opacity: 0,
      y: 50,
    },
    enter: () => async next => {
      await sleep(1000);
      next({ opacity: 1, y: 0 });
    },
    leave: {
      opacity: 0,
      y: 50,
    },
    trail: 100,
  });
  return (
    <FullHeightInner>
      <StyledWork>
        <div>
          <AnimatedCharacters
            text={"Selected work"}
            animateX
            animateY={false}
            toggle={isActive}
            TextComponent={a.h1}
            delay={500}
          ></AnimatedCharacters>
        </div>
        <Projects>
          {transition.map(
            ({ item, key, props: { opacity, y } }) =>
              item && (
                <a.li
                  key={key}
                  style={{
                    opacity,
                    transform: y.interpolate(
                      yVal => `translate3d(${yVal}px, 0px, 0px)`
                    ),
                  }}
                >
                  <Link to={item.node.frontmatter.slug}>
                    {item.node.frontmatter.title}
                  </Link>
                </a.li>
              )
          )}
        </Projects>
      </StyledWork>
    </FullHeightInner>
  );
}

export const pageQuery = graphql`
  query {
    allMarkdownRemark(limit: 1000) {
      edges {
        node {
          frontmatter {
            slug
            title
          }
        }
      }
    }
  }
`;

const Projects = styled.ul`
  align-self: flex-end;
  padding: 0px;

  li {
    list-style-type: none;
    text-align: right;

    font-size: 3em;
    margin-bottom: 30px;

    a {
      color: #fff;
      text-decoration: none;
      font-family: "Castoro Italic", serif;
      &::visited {
        color: #fff;
      }
    }
  }
`;

const StyledWork = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    width: 50%;
  }
`;
