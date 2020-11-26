import React, { useMemo, useEffect, useRef } from "react";
import { useTransition, animated as a } from "react-spring";
import styled from "styled-components";

import { sleep } from "../utils";
// https://stackoverflow.com/questions/60995685/react-spring-how-to-animate-letters-of-an-array-correctly

export function AnimatedCharacters({
  text,
  toggle,
  delay = 800,
  options = { height: 80, spacing: 4, align: "left" },
  springConfig = { mass: 5, tension: 2000, friction: 200 },
  TextComponent,
  containerStyle = {},
}) {
  const items = useMemo(
    () =>
      toggle
        ? text.split("").map((c, i) => ({
            id: i,
            hasDelay: i === 0,
            trail: i * 50,
            character: c,
          }))
        : [],
    [toggle]
  );

  const transition = useTransition(items, item => item.id, {
    from: {
      height: 0,
      opacity: 0,
      transformY: 20,
    },
    enter: item => async next => {
      await sleep(delay + item.trail);
      next({ height: options.height, opacity: 1, transformY: 0 });
    },
    leave: {
      height: 0,
      opacity: 0,
      transformY: 20,
    },
    // trail: 200,
    config: springConfig,
  });

  return (
    <div
      className="animated-title"
      style={{ ...containerStyle, textAlign: options.align }}
    >
      {transition.map(
        ({ item, key, props: { transformY, height, opacity } }) => {
          return (
            item && (
              <TrailCharacter
                key={key}
                style={{
                  transform: transformY.interpolate(
                    y => `translate3d(0px, ${y}px, 0px)`
                  ),
                  opacity,
                }}
                spacing={options.spacing}
                height={options.height}
              >
                <TextComponent style={{ height }}>
                  {item.character}
                </TextComponent>
              </TrailCharacter>
            )
          );
        }
      )}
    </div>
  );
}

export function AnimatedParagraph({
  items,
  delay = 1000,
  options = { height: 80, spacing: 0 },
  TextComponent,
  containerStyle = {},
  toggle,
  springConfig = { mass: 5, tension: 2000, friction: 200 },
  animateHeight = true,
}) {
  const words = useMemo(
    () => (toggle ? items.map((w, i) => ({ id: i, word: w })) : []),
    [toggle]
  );

  const text = useRef();
  const heightRef = useRef(options.height || 40);

  useEffect(() => {
    if (text.current) {
      const textHeight = parseInt(
        window.getComputedStyle(text.current).fontSize,
        10
      );
      const spacing = options.spacing || 0;
      if (textHeight < 30) heightRef.current = textHeight * 2.5;
      if (textHeight > 30) heightRef.current = textHeight * 1.25;

      heightRef.current += spacing;
    }
  }, []);

  const transition = useTransition(words, ({ id }) => id, {
    from: {
      height: 0,
      opacity: 0,
      transformY: 20,
    },
    enter: () => async next => {
      await sleep(delay);
      next({ height: heightRef.current, opacity: 1, transformY: 0 });
    },
    leave: () => async next => {
      if (animateHeight) next({ height: 0, opacity: 0, transformY: 20 });
      else next({ opacity: 0 });
    },
    trail: 175,
    config: springConfig,
  });

  return (
    <div style={containerStyle} className="animated-paragraph">
      {transition.map(
        ({ item, key, props: { transformY, height, opacity } }) =>
          item && (
            <TrailWord
              key={key}
              style={{
                transform: transformY.interpolate(
                  y => `translate3d(0px, ${y}px, 0px)`
                ),
                opacity,
              }}
              spacing={options.spacing}
              height={heightRef.current}
            >
              <TextComponent ref={text} style={{ height }}>
                {item.word}
              </TextComponent>
            </TrailWord>
          )
      )}
    </div>
  );
}

const TrailCharacter = styled(a.span)`
  position: relative;
  overflow: hidden;
  will-change: transform, opacity;
  line-height: ${({ height }) => height}px;
  height: ${({ height }) => height}px;
  display: inline-block;
  /* Needed because inline-block removes spaces */
  margin-right: ${({ spacing }) => spacing}px;
`;

const TrailWord = styled(a.span)`
  position: relative;
  overflow: hidden;
  will-change: transform, opacity;
  line-height: ${({ height }) => height}px;
  height: ${({ height }) => height}px;

  display: block;
  /* Needed because inline-block removes spaces */
  margin-right: ${({ spacing }) => spacing}px;
  /* display: flex;
  align-content: flex-start; */
`;
