import React, { useMemo } from "react";
import { graphql, Link } from "gatsby";
import styled from "styled-components";
import { useTransition, animated as a } from "react-spring";
import { Inner } from "../components/styled/Inner";

import { useRouteActive } from "../hooks";
import { sleep } from "../utils";

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
      sleep(2000);
      next({ opacity: 1, y: 0 });
    },
    leave: {
      opacity: 0,
      y: 50,
    },
    trail: 180,
  });
  return (
    <Inner>
      <StyledWork>
        <h2>My work</h2>
        <Projects>
          {transition.map(
            ({ item, key, props: { opacity, y } }) =>
              item && (
                <a.li
                  key={key}
                  style={{
                    opacity,
                    transform: y.interpolate(
                      yVal => `translate3d(0px, ${yVal}px, 0px)`
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
    </Inner>
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
    margin-bottom: 20px;

    a {
      color: #fff;
      text-decoration: none;
      font-family: "Modernist"
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
