import create from "zustand";

const colors = {
  default: {
    value: "#1F1F1F",
    intensity: 0,
  },
  about: {
    value: "#FC9E4F",
    intensity: 1.0,
  },
  relive_worldview: {
    value: "#437844",
    intensity: 0.5,
  },
  // relive_cards: {
  //   value: "#04ff00",
  //   intensity: 0.5,
  // },
  // train_met_lef: {
  //   value: "#ff00bb",
  //   intensity: 0.5,
  // },
  lv_200: {
    value: "#ff9500",
    intensity: 0.6,
  },  
  spotify_made_to_be_found: {
    value: "#437844",
    intensity: 0.8,
  },  
  wsj_the_field: {
    value: "#ff00bb",
    intensity: 0.5,
  },  
  // changeroo: {
  //   value: "#ff9500",
  //   intensity: 0.5,
  // },
  // chainels_consumersites: {
  //   value: "#00c3ff",
  //   intensity: 0.7,
  // },
  chainels_homepage: {
    value: "#fbff00",
    intensity: 0.5,
  },
  creative_coding: {
    value: "#000",
    intensity: 1.0,
  },
};

export const useStore = create(set => ({
  color: colors["default"],
  key: "default",
  setColor: value =>
    set(({ key }) => {
      if (value === key) return;

      if (!{}.hasOwnProperty.call(colors, value))
        return { color: colors["default"] };

      return { color: colors[value], key: value };
    }),
}));
