import React, { useMemo, useEffect, useRef } from "react";
import { useTransition, animated as a, interpolate } from "react-spring";
import styled from "styled-components";

import { sleep } from "../utils";

export function AnimatedCharacters({
  text,
  toggle,
  animateX = false,
  animateY = true,
  delay = 800,
  wordDelay,
  options = { height: 80, spacing: 4, align: "left" },
  springConfig = { mass: 5, tension: 2000, friction: 200 },
  TextComponent,
  containerStyle = {},
}) {
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

  const transition = useTransition(items, item => item.id, {
    from: {
      opacity: 0,
      transformX: animateX ? -20 : 0,
      transformY: animateY ? 20 : 0,
    },
    enter: item => async next => {
      const possibleWordDelay =
        item.character === " " && wordDelay ? wordDelay : 0;
      await sleep(delay + item.trail + possibleWordDelay);
      // if (item.character === " " && wordDelay) await sleep();
      next({ opacity: 1, transformY: 0, transformX: 0 });
    },
    leave: item => async next => {
      await sleep(item.trail);
      next({
        opacity: 0,
        transformX: animateX ? -20 : 0,
        transformY: animateY ? 20 : 0,
      });
    },
    // trail: 200,
    config: springConfig,
  });

  return (
    <CharacterWrapper
      className="animated-title"
      style={{ ...containerStyle, textAlign: options.align }}
    >
      {transition.map(
        ({ item, key, props: { transformX, transformY, opacity } }) => {
          return (
            item && (
              <TextComponent
                key={key}
                className=""
                style={{
                  transform: interpolate(
                    [transformX, transformY],
                    (x, y) => `translate3d(${x}px, ${y}px, 0px)`
                  ),
                  opacity,
                }}
              >
                {item.character === " " ? <span>&nbsp;</span> : item.character}
              </TextComponent>
            )
          );
        }
      )}
    </CharacterWrapper>
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

const CharacterWrapper = styled.div`
  display: inline;
  * {
    display: inline-block;
  }
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
