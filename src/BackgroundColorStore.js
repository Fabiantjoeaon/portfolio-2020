import create from "zustand";

const colors = {
  default: {
    value: "#1F1F1F",
    intensity: 0,
  },
  relive_worldview: {
    value: "#437844",
    intensity: 0.5,
  },
  relive_cards: {
    value: "#04ff00",
    intensity: 0.5,
  },
  train_met_lef: {
    value: "#ff00bb",
    intensity: 0.5,
  },
  changeroo: {
    value: "#ff9500",
    intensity: 0.5,
  },
  chainels_consumersites: {
    value: "#0000FF",
    intensity: 0.5,
  },
  chainels_homepage: {
    value: "#fbff00",
    intensity: 0.5,
  },
  webgl_experiments: {
    value: "#00c3ff",
    intensity: 0.5,
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
