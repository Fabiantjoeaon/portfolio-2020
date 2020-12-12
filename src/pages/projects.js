import React, { useEffect, useMemo, useRef } from "react";
import { graphql, Link } from "gatsby";
import styled from "styled-components";
import { useTransition, animated as a } from "react-spring";
import { FullHeightInner } from "../components/styled/Inner";

import { useRouteActive, useWindowSize } from "../hooks";
import { sleep } from "../utils";
import { AnimatedCharacters } from "../components/AnimatedText";
import { useStore } from "../BackgroundColorStore";
import { widthMap, breakpoints } from "../components/styled/media";

export default function ProjectPage({
  path,
  data: {
    allMarkdownRemark: { edges: pages },
  },
}) {
  const setColor = useStore(state => state.setColor);
  const clickLock = useRef(true);
  const isActive = useRouteActive(path, "/projects/");
  const sortedProjects = pages.sort(
    (a, b) => a.node.frontmatter.order - b.node.frontmatter.order
  );
  const items = useMemo(() => (isActive ? sortedProjects : []), [isActive]);

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

  useEffect(() => {
    if (isActive) setColor("default");

    setTimeout(() => {
      if (clickLock.current) clickLock.current = false;
    }, 2200);
  }, [isActive]);

  return (
    <FullHeightInner>
      <StyledWork>
        <AnimatedCharacters
          text={"Selected work"}
          animateX
          animateY={false}
          toggle={isActive}
          TextComponent={a.h1}
          delay={1000}
          breakConditions={{
            width: widthMap.mdPlus,
          }}
        ></AnimatedCharacters>

        <Projects
          onMouseLeave={() => {
            if (!clickLock.current) setColor("default");
          }}
          onClick={() => {
            clickLock.current = true;
          }}
        >
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
                  <Link
                    onMouseOver={() => {
                      if (!clickLock.current)
                        setColor(
                          item.node.frontmatter.slug
                            .replace("/projects/", "")
                            .replaceAll("-", "_")
                        );
                    }}
                    to={item.node.frontmatter.slug}
                  >
                    {item.node.frontmatter.title.toLowerCase()}
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
            description
            tools
            client
            date
            order
          }
        }
      }
    }
  }
`;

const Projects = styled.ul`
  align-self: flex-end;
  padding: 0px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  height: 100%;
  margin: 0px;

  ${breakpoints.mobileDevices} {
    width: 100%;
    margin-top: 50px;
    height: 75%;
  }

  li {
    list-style-type: none;
    text-align: right;

    a {
      font-size: 3.2em;
      color: #fff;
      text-decoration: none;
      font-family: "Modernist Regular", serif;

      /* font-family: "Castoro Regular", serif; */
      /* -webkit-text-fill-color: rgba(0, 0, 0, 0);

      -webkit-text-stroke-width: 1px;
      -webkit-text-stroke-color: #fff; */
      &::visited {
        color: #fff;
      }

      ${breakpoints.mdPlus} {
        font-size: 2.5em;
      }
      ${breakpoints.mobileDevices} {
        font-size: 3em;
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

  h1 {
    text-transform: uppercase;

    letter-spacing: 1px;
    -webkit-text-fill-color: rgba(0, 0, 0, 0);
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: #fff;
    margin: 0px;
  }

  height: 60%;

  ${breakpoints.xl} {
    height: 50%;
  }

  ${breakpoints.lg} {
    height: 50%;
    h1 {
      font-size: 4em;
    }
  }

  ${breakpoints.mdPlus} {
    height: 37%;
    h1 {
      font-size: 4em;
    }
  }

  ${breakpoints.mobileDevices} {
    height: 70%;
    flex-flow: column nowrap;
    align-items: flex-start;

    h1 {
      font-style: "Modernist Light", sans-serif !important;
      -webkit-text-stroke-width: 1px;
    }
  }
`;
