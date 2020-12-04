const settings = {
  maxInnerWidth: {
    xl: "1550px",
    lg: "1260px",

    mdPlus: "1100px",
    mdMed: "950px",
    // mdMin: "920px",
    // md: "900px",
    md: "85%",
    mdMin: "85%",

    sm: "85%",
  },

  maxOuterWidth: {
    xl: "90%",
    lg: "90%",
    mdPlus: "90%",
    mdMed: "90%",
    mdMin: "90%",
    md: "90%",
    sm: "90%",
  },

  maxOuterWidth: {
    desktop: "80px",
    desktopSmall: "80px",
    mobile: "80px",
  },

  navigationHeight: {
    desktop: "100px",
    mobile: "80px",
  },
  initialLoadingTime: 6000,

  easing1: "cubic-bezier(0.666, 0, 0.237, 1)",
};

export const theme = {
  ...settings,
};
