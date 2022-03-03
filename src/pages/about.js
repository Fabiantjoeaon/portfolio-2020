import React, { useMemo, useEffect } from "react";
import styled from "styled-components";
import { useTransition, animated as a } from "react-spring";

import {
  AnimatedCharacters,
  AnimatedParagraph,
} from "../components/AnimatedText";

import { FullHeightInner } from "../components/styled/Inner";
import { useRouteActive } from "../hooks";
import { sleep } from "../utils";
import { useStore } from "../BackgroundColorStore";
import { Link } from "gatsby";
import { breakpoints } from "../components/styled/media";

export default function AboutPage({ path }) {
  const setColor = useStore(state => state.setColor);
  const isActive = useRouteActive(path, "/about/");
  useEffect(() => {
    if (isActive) setColor("about");
  }, [isActive]);

  function calculateAge(birthday) {
    const ageDiff = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  return (
    <FullHeightInner>
      <AboutInner>
        <div className="about__left">
          <AnimatedCharacters
            toggle={isActive}
            text="Hi there!"
            TextComponent={a.h1}
            animateY={false}
            animateX
          />
        </div>

        <div className="about__right">
          <div className="paragraph">
            <AnimatedParagraph
              items={[
                `I'm a 26 year old creative developer from Rotterdam, with a passion`,
                "for (3D) graphics on the web and electronic music.",
              ]}
              delay={1000}
              TextComponent={a.p}
              toggle={isActive}
            ></AnimatedParagraph>
          </div>
          <div className="paragraph">
            <AnimatedParagraph
              items={[
                "I love digital immersive experiences, pushing the browser to it's limitations",
                "- and if necessary, keeping functionality in mind.",
              ]}
              delay={1200}
              TextComponent={a.p}
              toggle={isActive}
            ></AnimatedParagraph>
          </div>
          <div className="paragraph">
            <AnimatedParagraph
              items={[
                "I am currenly working as a front-end developer at Active Theory.",
              ]}
              delay={1400}
              TextComponent={a.p}
              toggle={isActive}
            ></AnimatedParagraph>
          </div>
        </div>
      </AboutInner>
    </FullHeightInner>
  );
}

const AboutInner = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  ${breakpoints.mobileDevices} {
    flex-flow: column nowrap;
    justify-content: flex-start;
  }

  p {
    margin: 0px;
    font-family: "Modernist Light", sans-serif;

    line-height: 1.85em;
  }

  .about__left {
    ${breakpoints.mobileDevices} {
      margin-top: 100px;
      width: 100%;
      margin-bottom: 20px;
    }
  }
  .about__right {
    .paragraph {
      margin-bottom: 30px;
    }
  }

  ${breakpoints.lg} {
    font-size: 0.8em;

    .about__right {
      width: 60%;
    }
  }
  ${breakpoints.mobileDevices} {
    font-size: 1em;
    .about__right {
      width: 100%;
    }
  }
`;
