import { Variants } from "motion/react";

export const fadeOut: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      ease: "easeOut",
    },
  },
};

export const fadeTranslateOut: Variants = {
  hidden: {
    opacity: 0,
    y: "100%",
    transition: { ease: "easeOut", duration: 0.2 },
  },
  visible: (idx: number) => ({
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut", duration: 0.2, delay: idx * 0.06 },
  }),
};
