import React from "react";

import { graphql } from "gatsby";
import { Inner } from "../components/styled/Inner";
import styled, { createGlobalStyle } from "styled-components";

export default function Template({ data }) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;

  return (
    <Inner>
      <AllowBodyScroll />
      <GeneralPostStyling />
      <BlogTemplateInner>
        <div className="project-template__intro">
          <h2>{frontmatter.title}</h2>

          <div className="project__meta">
            <div className="project__meta__top">
              {frontmatter.description && (
                <div className="project__description">
                  <p>{frontmatter.description}</p>
                </div>
              )}
            </div>
            <div className="project__meta__bottom">
              {frontmatter.date && (
                <div className="project__date">
                  <p>{frontmatter.date}</p>
                </div>
              )}
              {frontmatter.client && (
                <div className="project__client">
                  <p>
                    <strong>Client: </strong>
                  </p>
                  <p>
                    <span>{frontmatter.client}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className="project-template__content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </BlogTemplateInner>
    </Inner>
  );
}

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        slug
        title
        description
        tools
        client
        date
      }
    }
  }
`;

const BlogTemplateInner = styled.div`
  .project-template__intro {
    display: flex;
    align-items: flex-start;

    flex-flow: column nowrap;
    justify-content: flex-end;
    width: 100%;
    height: 100vh;
    position: relative;
    /* margin-bottom: 200px; */
  }

  h2 {
    margin: 0px 0px;
    position: absolute; /* new */
    top: 50%;
    transform: translateY(-50%);
    flex: 1 0 auto;
  }

  .project__meta {
    justify-self: flex-end;
    /* padding-bottom: 100px; */

    display: flex;
    width: 100%;
    justify-content: space-between;
    flex-flow: row wrap;
    flex: 0.4;

    .project__meta__top,
    .project__meta__bottom {
      width: 100%;
    }

    .project__meta__bottom {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-bottom: 50px;
      p {
        margin: 0px;
      }

      .project__date {
        font-size: 3.5em;

        color: #fff;
        p {
          line-height: 1.1em;
          font-family: "Modernist Bold", sans-serif;
          vertical-align: bottom;
        }
      }

      .project__client {
        p,
        strong {
          text-align: right;
        }
        span {
          display: block;
          height: 100%;
          font-family: "Modernist Light", sans-serif;
        }
        strong {
          display: block;
          height: 100%;
          font-family: "Modernist Bold", sans-serif;
        }
      }
    }

    .project__description {
      p {
        font-family: "Modernist Light", sans-serif;
        color: #d5d5d5;
        /* font-style: ; */
      }
    }
  }

  .project-template__content {
    padding: 250px 0px;
  }
`;

export const AllowBodyScroll = createGlobalStyle`
  body,
  html {
    overflow: scroll;
  }
`;

const GeneralPostStyling = createGlobalStyle`
  .content__wrapper {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      margin: 100px 0px;

      

      .content__left,
      .content__right {
        width: 40%;

        &.align-right {
          text-align: right;
        }
      }      
  }

  .embed-container {
      margin: 170px auto 140px;
      width: 100%;

  }

  p, .content__wrapper {
    /* font-size: 1.5em; */
      line-height: 1.6em;
  }

  blockquote {
    font-style: italic;
    color: #bfbfbf;
    p {
      font-family: "Modernist Mono", sans-serif;
    }
    
  }

  a {
    color: #fff;

    &::visited {
      color: #fff;
    }
  }
  p {
    margin: 40px 0px;
  }
  ul {
    padding-left: 50px;
    li {
      font-size: 1.2em;
      margin-bottom: 10px; 
      list-style-type: circle;
      font-family: "Modernist Mono", sans-serif;
      font-style: italic;
    }
  }

  .tools {
    width: 100%;
    margin: 240px 0px;
    ul {
      padding-left: 0px;
      li {
      font-style: normal;
      list-style-type: none;
      font-family: "Modernist Bold", sans-serif;
      font-size: 3em;
      margin-bottom: 25px;
      }
    }
    

  }
  
`;
