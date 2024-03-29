import React, { useEffect, useRef } from "react";
import { useSpring, useTransition, animated as a } from "react-spring";
import { graphql } from "gatsby";
import { Inner } from "../components/styled/Inner";
import styled, { createGlobalStyle } from "styled-components";

import {
  breakpoints,
  mobileBreakpoint,
  widthMap,
} from "../components/styled/media";
import { useRouteActive, useFluidValue, useWindowSize } from "../hooks";
import { AnimatedCharacters } from "../components/AnimatedText";
import { sleep } from "../utils";
import { useStore } from "../BackgroundColorStore";
import AnimatedLine from "../components/AnimatedLine";

export default function Template({ data, path }) {
  const { markdownRemark } = data;
  const {
    frontmatter: { description, title, date, link: projectLink },
    html,
  } = markdownRemark;

  const setColor = useStore(state => state.setColor);

  useEffect(() => {
    setColor(path.replace("/projects/", "").replaceAll("-", "_"));
  }, []);

  const isActive = useRouteActive(path, "projects", true);

  const { width, height } = useWindowSize();
  const circleRadius = useFluidValue(width, 30, 49);
  const descriptionLineWidthRadius = useFluidValue(width, 125, 135);

  const heightRef = useRef(height);

  const descriptionTransition = useTransition(isActive, null, {
    from: {
      opacity: 0,
      x: -100,
    },
    enter: () => async next => {
      await sleep(1400);
      await next({ opacity: 1, x: 0 });
    },
    leave: {
      opacity: 0,
      x: -100,
    },
  });

  const circleTransition = useTransition(isActive, null, {
    from: {
      offset: 400,
    },
    enter: () => async next => {
      await sleep(1800);
      await next({ offset: 0 });
    },
    leave: {
      offset: 400,
    },
    config: {
      friction: 80,
      tension: 120,
    },
  });

  const lineTransition = useTransition(isActive, null, {
    from: { scaleY: 0, transformOrigin: "bottom" },
    enter: () => async next => {
      await sleep(2000);
      while (isActive) {
        await next({ scaleY: 1, transformOrigin: "top" });
        await next({ scaleY: 0, transformOrigin: "bottom" });
      }
    },
    leave: {
      scaleY: 0,
    },
    config: {
      friction: 40,
      tension: 250,
    },
  });

  const scrollTextTransition = useTransition(isActive, null, {
    from: {
      y: 20,
      opacity: 0,
    },
    enter: () => async next => {
      await sleep(2500);
      next({ y: 0, opacity: 1 });
    },
    leave: {
      y: 20,
      opacity: 0,
    },
  });

  const linkComponent = ({ item, key, props: { opacity, y } }) =>
    projectLink ? (
      <a.a
        href={projectLink}
        target="_blank"
        key={key}
        style={{
          opacity,
          transform: y.interpolate(yVal => `translate3d(0px, ${yVal}px, 0px)`),
        }}
      >
        Visit site here
      </a.a>
    ) : (
      item && (
        <a.span
          key={key}
          style={{
            opacity,
            transform: y.interpolate(
              yVal => `translate3d(0px, ${yVal}px, 0px)`
            ),
          }}
        >
          Scroll down to learn more
        </a.span>
      )
    );

  return (
    <Inner>
      <AllowBodyScroll />
      <GeneralPostStyling />
      <BlogTemplateInner height={heightRef.current}>
        <div className="project-template__intro">
          <div className="project__title">
            <AnimatedCharacters
              text={title}
              animateX
              animateY={false}
              delay={500}
              toggle={isActive}
              TextComponent={a.h1}
              breakConditions={{
                width: widthMap.sm,
                characterLength: 10,
              }}
            />
          </div>

          <div className="project__meta">
            <div className="project__meta__top">
              <div className="project__description">
                <div className="project__description__inner">
                  <AnimatedLine
                    toggle={isActive}
                    width={descriptionLineWidthRadius}
                    delay={1450}
                  />
                  {descriptionTransition.map(
                    ({ item, key, props: { opacity, x } }) =>
                      item && (
                        <a.p
                          key={key}
                          style={{
                            opacity,
                            transform: x.interpolate(
                              xVal => `translate3d(${xVal}px, 0px, 0px)`
                            ),
                          }}
                        >
                          {description}
                        </a.p>
                      )
                  )}
                </div>
              </div>
              <div className="project__scroll_indicator__wrapper">
                <div className="project__scroll">
                  {scrollTextTransition.map(
                    ({ item, key, props: { opacity, y } }) =>
                      item && (
                        <a.span
                          key={key}
                          style={{
                            opacity,
                            transform: y.interpolate(
                              yVal => `translate3d(0px, ${yVal}px, 0px)`
                            ),
                          }}
                        >
                          Scroll down to learn more
                        </a.span>
                      )
                  )}
                </div>
                <div className="project__scroll_indicator">
                  <svg
                    width={circleRadius * 2 + 2}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {circleTransition.map(
                      ({ item, key, props }) =>
                        item && (
                          <a.path
                            key={key}
                            className="circle"
                            strokeDashoffset={props.offset}
                            d={`
                              M ${circleRadius + 1}, ${circleRadius + 1}
                              m -${circleRadius}, 0
                              a ${circleRadius},${circleRadius} 0 1,0 ${
                              circleRadius * 2
                            },0
                              a ${circleRadius},${circleRadius} 0 1,0 -${
                              circleRadius * 2
                            },0
                            `}
                          />
                        )
                    )}
                  </svg>
                  {lineTransition.map(
                    ({ item, key, props: { scaleY, transformOrigin } }) =>
                      item && (
                        <a.span
                          key={key}
                          style={{
                            transformOrigin,
                            transform: scaleY.interpolate(y => `scaleY(${y})`),
                            top: `${circleRadius + 4}px`,
                            height: `${circleRadius * 2}px`,
                          }}
                          className="indicator"
                        />
                      )
                  )}
                </div>
              </div>
            </div>
            <div className="project__meta__bottom">
              <div className="project__date">
                <AnimatedCharacters
                  toggle={isActive}
                  TextComponent={a.p}
                  text={date}
                  delay={1600}
                  breakConditions={{
                    character: "/",
                    width: mobileBreakpoint,
                  }}
                ></AnimatedCharacters>
              </div>
              <div className="project__scroll">
                {scrollTextTransition.map(linkComponent)}
              </div>
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
        link
        agency
        date
        order
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
    height: ${({ height }) => height}px;
    position: relative;

    ${breakpoints.mobileDevices} {
      // nav height
      height: ${({ theme, height }) =>
        `calc(${height}px - ${theme.navigationHeight.mobile})`};
      margin-top: ${({ theme }) => theme.navigationHeight.mobile};
      justify-content: space-between;
    }
  }

  .project__title {
    position: absolute; /* new */
    top: 50%;
    transform: translateY(-50%);

    flex: 1 0 auto;
    h1 {
      text-transform: uppercase;
      -webkit-text-fill-color: rgba(0, 0, 0, 0);
      -webkit-text-stroke-width: 1px;
      -webkit-text-stroke-color: #fff;
      /* text-shadow: 0 0 0; */
      /* -webkit-text-fill-color: rgba(0, 0, 0, 0); */
      /* text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
        1px 1px 0 #000; */
      /* color: rgba(0, 0, 0, 0); */
      letter-spacing: 1px;
      margin: 0px 0px;
      line-height: 1;
    }

    ${breakpoints.mobileDevices} {
      position: relative;
      transform: translateY(0px);
      flex: 0;
      top: 0%;
      margin-top: 200px;

      h1 {
        font-size: 4.5em;
      }
    }

    ${breakpoints.smPlus} {
      margin-top: 10px;
    }
  }

  .project__scroll {
    font-size: 1.4em;
    line-height: 3em;
    font-family: "Modernist Regular", serif;
    text-align: right;

    ${breakpoints.mobileDevices} {
      display: none;
    }
  }
  .project__scroll_indicator__wrapper {
    display: flex;

    .project__scroll {
      display: none;
    }

    ${breakpoints.mobileDevices} {
      justify-content: space-between;
      flex-flow: row;

      .project__scroll {
        display: block;

        line-height: 1.4em;
        font-size: 1.9em;
        width: 100px;
        text-align: left;

        span {
          vertical-align: top;
        }
      }
    }
  }
  .project__scroll_indicator {
    width: 100px;
    height: 125px;
    position: relative;
    display: flex;
    justify-content: center;
    .indicator {
      position: absolute;

      left: 50%;
      width: 1px;

      /* transform: rotate(90deg); */
      margin: 0px;
      background-color: #fff;
    }
  }
  .project__meta {
    justify-self: flex-end;
    /* padding-bottom: 100px; */

    display: flex;
    width: 100%;
    justify-content: space-between;
    flex-flow: row wrap;
    flex: 0.4;

    ${breakpoints.lg} {
      flex: 0.3;
    }
    ${breakpoints.mobileDevices} {
      flex: 0.9;
    }

    .project__meta__top,
    .project__meta__bottom {
      width: 100%;
      display: flex;
      justify-content: space-between;
      svg {
        stroke: #fff;
        fill: rgba(0, 0, 0, 0);
        /* width: 100%; */
        height: 100%;

        .circle {
          stroke-dasharray: 400;
        }
      }
    }

    ${breakpoints.mobileDevices} {
      .project__meta__top {
        flex-flow: column nowrap;
      }
    }

    .project__meta__bottom {
      align-items: flex-end;
      padding-bottom: 50px;
      p {
        margin: 0px;
      }

      ${breakpoints.mobileDevices} {
        padding-bottom: 30px;
      }

      .project__date {
        font-size: 3.5em;

        color: #fff;
        p {
          line-height: 1.1em;
          font-family: "Modernist Bold", sans-serif;
          vertical-align: bottom;
        }

        ${breakpoints.mdPlus} {
          font-size: 3em;
        }

        ${breakpoints.mobileDevices} {
          font-size: 2.5em;
          line-height: 1.6em;
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
          font-family: "Castoro Italic", sans-serif;
        }
        strong {
          display: block;
          height: 100%;
          font-family: "Modernist Bold", sans-serif;
        }
      }
    }

    .project__description {
      .project__description__inner {
        display: flex;
        align-items: center;
        span {
          background-color: #fff;
        }
        p {
          margin-left: 100px;
          font-family: "Castoro Italic", serif;
          color: #fff;
          margin-top: 0px;
          margin: 0px 0px 0px 30px !important;
          ${breakpoints.mobileDevices} {
            text-align: right;
          }
        }
      }
    }
  }

  .project-template__content {
    padding: 250px 0px;

    ${breakpoints.mobileDevices} {
      padding: 90px 0px;
    }
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

      &.no-margin {
        margin: 0px 0px;
      }

      .gatsby-video-aspect-ratio {
        /* width: 70%; */
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;

        ${breakpoints.mobileDevices} {
          max-width:none;
        }
      }
      video {
        /* height: 100% !important;
        margin: 50px 0px; */
        width: 100%;
        height: 100%; 
      }

      .gatsby-resp-image-wrapper {
          width: 100%;
          max-width: 1200px;
      }

      &.project--webgl {
        margin: 200px 0px;
      }

      .content__left,
      .content__right {
        width: 40%;

        .gatsby-video-aspect-ratio  {
          max-width: none;
        }

        &.align-right {
          text-align: right;
        }

        &.vert-align {
          display: flex;
          align-items: center;       
        }

        &.w-10 {
          width: 10%;
        }
        &.w-20 {
          width: 20%;
        }
        &.w-30 {
          width: 30%;
        }
        &.w-40 {
          width: 40%;
        }
        &.w-50 {
          width: 50%;
        }
        &.w-60 {
          width: 60%;
        }
        &.w-70 {
          width: 70%;
        }
        &.w-80 {
          width: 80%;

          .gatsby-resp-image-wrapper {
            max-width: 1000px !important;
            margin-right: 0px;
          }
        }
      }      
  }

  .embed-container {
      margin: 170px auto 140px;
      width: 100%;

  }

  h2 {
    line-height: 1.3em;
    font-size: 4em;
  }

  h3 {
    font-size: 3em;
    line-height: 1.7em;
  }

  .project--webgl {
    h2 {
      margin: 0px;
    }

    
  }

  p, .content__wrapper {
    /* font-size: 1.5em; */
      line-height: 1.65em;
      ${breakpoints.mobileDevices} {
        line-height: 1.95em;
      }
  }

  p {
    font-family: "Modernist Regular", sans-serif;
    font-size: 1.3em;
  }

  blockquote {
    font-style: italic;
    color: #bfbfbf;
    p {
      /* font-family: "Modernist Mono", sans-serif; */
      font-family: "Castoro Italic", serif;
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
    padding-left: 30px;
    li {
      font-size: 1.4em;
      margin-bottom: 10px; 
      list-style-type: none;
      font-family: "Modernist Light", sans-serif;
      line-height: 1.55em;
      /* font-style: italic; */
    }
  }

  .tools {
    width: 100%;
    margin: 190px 0px;

    ${breakpoints.mobileDevices} {
      margin: 50px 0px;
    }

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

  ${breakpoints.mobileDevices} {
    
    .content__wrapper {
      flex-flow: column-reverse nowrap;

    &.project--worldview {
      margin: 30px 0px;
    }

      &.project--webgl {
        margin: 100px 0px; 
      }

      .content__left, .content__right, .w-50, .w-60, .w-70, .w-80 {
        width: 100% !important;
      }

      .gatsby-resp-image-wrapper {
        margin-bottom: 50px;
      }

      h2 {
        font-size: 2.7em;
      }

      p {
        margin: 30px 0px;
      }

      
    }
  }
  
`;
