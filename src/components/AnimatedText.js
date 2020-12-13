import React, { useMemo, useLayoutEffect, useRef, useState } from "react";
import { useTransition, animated as a, interpolate } from "react-spring";
import styled from "styled-components";

import { sleep } from "../utils";
import { useWindowSize } from "../hooks";

function calculateWordDimensions(div) {
  // Not sure if this factor is different per font..
  const fontFactor = 8;
  const { width, height } = div.getBoundingClientRect();
  return { width, height: height + fontFactor };
}

// TODO: Dynamically calculate dimensions and only animate when calculated using toggle overwrite
export function AnimatedCharacters({
  text,
  toggle,
  animateX = false,
  animateY = true,
  animateFromOverflow = true,
  delay = 800,
  wordDelay,
  springConfig = { mass: 5, tension: 2000, friction: 200 },
  TextComponent,
  containerStyle = {},
  breakConditions,
}) {
  const { width } = useWindowSize();

  /**
   * Default break on every whitespace
   */
  const shouldBreakOnEveryWhitespace = useMemo(() => {
    if (!breakConditions || breakConditions?.character) return false;
    const widthDiff = width - breakConditions.width;
    return widthDiff < 0;
  }, [breakConditions, width]);

  /**
   * Break on a specific character
   */
  const breakCharacterIndex = useMemo(() => {
    if (!breakConditions?.character) return null;
    const widthDiff = width - breakConditions.width;

    return widthDiff < 0 ? text.indexOf(breakConditions.character) + 1 : null;
  }, [breakConditions, width]);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const textRef = useRef();
  const items = useMemo(
    () =>
      toggle
        ? text.split("").map((c, i) => {
            return {
              id: i,
              hasDelay: i === 0,
              trail: i * 50,
              character: c,
            };
          })
        : [],
    [toggle]
  );

  // useLayoutEffect(() => {
  //   if (text.current && toggle && animateY) {
  //     setDimensions(calculateWordDimensions(text.current));
  //   }
  // }, [text.current]);

  const transition = useTransition(items, item => item.id, {
    from: {
      opacity: 0,
      transformX: animateX ? (animateFromOverflow ? -100 : -20) : 0,
      transformY: animateY ? (animateFromOverflow ? 100 : 20) : 0,
      skew: animateFromOverflow ? 10 : 0,
    },
    enter: item => async next => {
      const possibleWordDelay =
        item.character === " " && wordDelay ? wordDelay : 0;
      await sleep(delay + item.trail + possibleWordDelay);
      // if (item.character === " " && wordDelay) await sleep();
      next({ opacity: 1, transformY: 0, transformX: 0, skew: 0 });
    },
    leave: item => async next => {
      await sleep(item.trail);
      next({
        opacity: 0,
        transformX: animateX ? (animateFromOverflow ? -100 : -20) : 0,
        transformY: animateY ? (animateFromOverflow ? 100 : 20) : 0,
        skew: animateFromOverflow ? 10 : 0,
      });
    },
    // trail: 200,
    config: springConfig,
  });

  return (
    <CharacterWrapper className="animated-title" style={{ ...containerStyle }}>
      {transition.map(
        (
          { item, key, props: { transformX, transformY, opacity, skew } },
          i
        ) => {
          const shouldBreak =
            shouldBreakOnEveryWhitespace || i === breakCharacterIndex;

          return item && item.character === " " ? (
            <TextComponent
              style={{
                display: shouldBreak ? "block" : "inline",
                height: shouldBreak ? "0px" : "auto",
              }}
              key={key}
            >
              &nbsp;
            </TextComponent>
          ) : (
            <a.div
              style={{
                width: "auto",
                height: "auto",
                overflow: animateFromOverflow ? "hidden" : "inherit",
              }}
              key={key}
            >
              <TextComponent
                key={key}
                ref={textRef}
                className=""
                style={{
                  transform: interpolate(
                    [transformX, transformY, skew],
                    (x, y, s) =>
                      `translate3d(${x}px, ${y}px, 0px) skew(${s}deg)`
                  ),
                  opacity: animateFromOverflow ? "1" : opacity,
                }}
              >
                {item.character}
              </TextComponent>
            </a.div>
          );
        }
      )}
    </CharacterWrapper>
  );
}

export function AnimatedParagraph({
  items,
  delay = 1000,
  TextComponent,
  containerStyle = {},
  toggle,
  springConfig = { tension: 200, friction: 60 },
  animateHeight = true,
}) {
  const text = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (text.current && toggle) {
      setDimensions(calculateWordDimensions(text.current));
    }
  }, [text.current]);

  const words = useMemo(
    () => (toggle ? items.map((w, i) => ({ id: i, word: w, trail: 175 })) : []),
    [dimensions.width]
  );

  const transition = useTransition(words, ({ id }) => id, {
    from: {
      // opacity: 0,
      transformY: dimensions.height || 100,
      skew: 40,
    },
    enter: item => async next => {
      await sleep(delay + item.trail);
      next({ transformY: 0, skew: 0 });
    },
    leave: () => async next => {
      if (animateHeight)
        next({ skew: 40, transformY: dimensions.height || 100 });
      // else next({ opacity: 0 });
    },

    config: springConfig,
  });

  // Maybe fix this for multiline wrapping: https://www.sitepoint.com/community/t/is-it-possible-to-detect-where-text-wraps/6606
  return (
    <div style={containerStyle} className="animated-paragraph">
      {transition.map(
        ({ item, key, props: { transformY, skew } }) =>
          item && (
            <a.div
              key={key}
              style={{
                width: "auto",
                height: "auto",
                overflow: "hidden",
              }}
            >
              <TextComponent
                key={key}
                style={{
                  overflow: "hidden",

                  transform: interpolate(
                    [transformY, skew],
                    (y, s) => `translate3d(0px, ${y}px, 0px) skew(${s}deg)`
                  ),

                  //width: dimensions.width || "auto",
                  //width: dimensions.width || "auto",
                }}
                ref={text}
              >
                {item.word}
              </TextComponent>
            </a.div>
          )
      )}
    </div>
  );
}

const CharacterWrapper = styled.div`
  display: inline;

  * {
    display: inline-block;
  }
`;
