import React, { useMemo } from "react";
import { graphql, Link } from "gatsby";
import styled from "styled-components";
import { useTransition, animated as a } from "react-spring";
import { FullHeightInner } from "../components/styled/Inner";

import { useRouteActive } from "../hooks";
import { sleep } from "../utils";
import { AnimatedCharacters } from "../components/AnimatedText";

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
      await sleep(2000);
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
            delay={1000}
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
    margin-bottom: 35px;

    a {
      color: #fff;
      text-decoration: none;
      font-family: "Castoro Italic", serif;
      &::visited {
        color: #fff;
      }
    }

    a {
      position: relative;

      &:hover {
        &::before {
          /* transform-origin: right; */
          transform: scaleX(1);
          opacity: 1;
          /* transform-origin: 100% 0%; */
        }
      }

      &::before,
      &::after {
        content: "";
        position: absolute;
        display: block;

        left: 0px;
        width: 100%;
        height: 1px;
        background-color: #fff;
        transform: scaleX(0);
        transition: all 0.5s ease-out;
        opacity: 0;
        /* transform-origin: left; */
      }

      &::before {
        /* transform-origin: left; */
        bottom: -10px;
        transform-origin: 0% 0%;
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
