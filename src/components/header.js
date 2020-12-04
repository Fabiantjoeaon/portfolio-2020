import React, { useMemo } from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";
import { useTransition, animated as a } from "react-spring";

import styled from "styled-components";
import { sleep } from "../utils";
import { outerWidthSpacing } from "./styled/spacing";
import { useWindowSize } from "../hooks";
import { breakpoints, mobileBreakpoint } from "./styled/media";

const Header = ({ siteTitle, loadingDone, path }) => {
  const transition = useTransition(loadingDone, null, {
    from: {
      opacity: 0,
      y: -120,
    },
    enter: () => async next => {
      await sleep(1500);
      next({ y: 0, opacity: 1 });
    },
    leave: {
      opacity: 1,
      y: 0,
    },
  });

  const { width } = useWindowSize();
  const isMobile = useMemo(() => width < mobileBreakpoint, [width]);

  return transition.map(
    ({ item, key, props: { opacity, y } }) =>
      item && (
        <StyledHeader
          style={{
            opacity,
            transform: y.interpolate(
              yVal => `translate3d(0px, ${yVal}px, 0px)`
            ),
          }}
          key={key}
        >
          <div className="header__inner">
            <Link to="/">
              <div className="header__left">
                {isMobile ? <span>F T</span> : <span>Fabian Tjoe-A-On</span>}
              </div>
            </Link>
            <div className="header__pages">
              <Link activeClassName={"active"} to="/about">
                About me
              </Link>
              <Link activeClassName={"active"} to="/projects">
                Selected work
              </Link>
            </div>

            <div className="header__socials">
              <a href="mailto:fabiantjoeaon@gmail.com">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 466 466">
                  <defs />
                  <path d="M233 0a233 233 0 10116 435l-29-51a175 175 0 1188-151v25c0 19-13 33-29 33-17 0-30-13-30-29V146h-40a115 115 0 00-193 87 117 117 0 00196 85c16 19 40 31 67 31 49 0 87-40 87-91v-25C466 104 361 0 233 0zm0 291a58 58 0 110-116 58 58 0 010 116z" />
                </svg>
              </a>

              <a href="https://twitter.com/fabiantjoe_a_on" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <defs />
                  <path d="M512 97c-19 9-39 14-60 17 21-13 38-34 46-58-21 12-43 20-67 25a105 105 0 00-179 96c-87-4-164-46-216-110a106 106 0 0032 140c-17 0-34-5-48-13v2c0 51 37 93 85 103a105 105 0 01-48 1c14 42 52 73 98 74A211 211 0 010 417c46 30 102 47 161 47a297 297 0 00298-312c21-15 39-34 53-55z" />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/fabiantjoeaon/"
                target="_blank"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <defs />
                  <path d="M24 24v-9c0-4-1-7-6-7l-5 2V8H8v16h5v-8c0-2 1-4 3-4 3 0 3 2 3 4v8zM0 8h5v16H0zM3 0C1 0 0 1 0 3s1 3 3 3 3-2 3-3c0-2-2-3-3-3z" />
                </svg>
              </a>
              <a href="https://github.com/fabiantjoeaon" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <defs />
                  <path d="m12 .5c-6.63 0-12 5.28-12 11.792 0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56 4.801-1.548 8.236-5.97 8.236-11.173 0-6.512-5.373-11.792-12-11.792z" />
                </svg>
              </a>
            </div>
          </div>
        </StyledHeader>
      )
  );
};

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

const StyledHeader = styled(a.div)`
  height: ${({ theme }) => theme.navigationHeight.desktop};
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  mix-blend-mode: difference;
  z-index: 1;

  ${breakpoints.mobileDevices} {
    height: ${({ theme }) => theme.navigationHeight.mobile};
  }

  /* font-family: "Modernist Light", sans-serif; */
  .header__inner {
    display: block;
    height: 100%;
    ${outerWidthSpacing};
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header__pages {
      display: flex;
      align-items: center;

      a {
        font-size: 1.2em;
        margin-right: 80px;
        color: #fff;

        position: relative;

        &:hover,
        &.active {
          &::before {
            transform: scaleX(1);
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
          transition: transform 0.3s ${({ theme }) => theme.easing1};
        }

        &::before {
          bottom: -10px;
          transform-origin: 0% 0%;
        }
      }

      ${breakpoints.mobileDevices} {
        justify-content: space-between;
        width: 40%;
        a {
          font-size: 1.4em;
          margin-right: 0px;
        }
      }
      ${breakpoints.smPlus} {
        width: 50%;
      }
      ${breakpoints.sm} {
        width: 60%;
      }
    }

    a {
      color: #fff;
      text-decoration: none;

      &::visited {
        color: #fff;
      }
    }

    .header__socials {
      display: flex;
      align-items: center;

      svg {
        fill: #fff;
        width: 20px;
        height: 20px;
        margin-left: 30px;
      }

      ${breakpoints.mobileDevices} {
        display: none;
      }
    }

    .header__left {
      font-family: "Modernist Bold", sans-serif;
      font-size: 1.4em;
      /* .tjoe {
        text-align: left;
        width: 100%;
        display: block;
      }
      .a-on {
        display: flex;
        justify-content: space-between;
      } */
      span {
        font-size: 1em;
        letter-spacing: 1px;
      }

      ${breakpoints.mobileDevices} {
        span {
          font-size: 1.8em;
        }
      }
    }
  }
`;

export default Header;
