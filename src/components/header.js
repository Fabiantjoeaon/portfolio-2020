import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";

import styled from "styled-components";
import { outerWidthSpacing } from "./styled/spacing";

const Header = ({ siteTitle }) => (
  <StyledHeader>
    <div className="header__inner">
      <Link to="/">
        <div className="header__left">
          <span>FABIAN </span>
          <span>TJOE A ON</span>
        </div>
      </Link>
      <div className="header__pages">
        <Link to="/projects">My work</Link>
        <Link to="/about">About me</Link>
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

        <a href="https://www.linkedin.com/in/fabiantjoeaon/" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <defs />
            <path d="M24 24v-9c0-4-1-7-6-7l-5 2V8H8v16h5v-8c0-2 1-4 3-4 3 0 3 2 3 4v8zM0 8h5v16H0zM3 0C1 0 0 1 0 3s1 3 3 3 3-2 3-3c0-2-2-3-3-3z" />
          </svg>
        </a>
        <a href="https://instagram.com/fabiantjoeaon" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 169 169">
            <defs />
            <path d="M122 0H47C21 0 0 21 0 47v75c0 26 21 47 47 47h75c26 0 47-21 47-47V47c0-26-21-47-47-47zm32 122c0 18-14 32-32 32H47c-18 0-32-14-32-32V47c0-18 14-32 32-32h75c18 0 32 14 32 32v75z" />
            <path d="M85 41a44 44 0 100 87 44 44 0 000-87zm0 72a29 29 0 110-57 29 29 0 010 57zM130 28a11 11 0 00-11 11 11 11 0 0011 11c3 0 6-1 8-3a11 11 0 000-16c-2-2-5-3-8-3z" />
          </svg>
        </a>
      </div>
    </div>
  </StyledHeader>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

const StyledHeader = styled.div`
  height: 100px;
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;

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
    }

    .header__left {
      span {
        font-size: 1.2em;
        letter-spacing: 1px;
        /* display: block; */
      }
    }
  }
`;

export default Header;
