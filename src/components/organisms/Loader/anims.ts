import { Variants } from "motion/react";

export const containerAnim: Variants = {
  exit: {
    y: "100%",
    transition: {
      delay: 0.3,
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

export const drawAnimation: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (custom: number) => ({
    pathLength: [0, 1, 0],
    strokeWidth: [1, 50, 0],
    pathOffset: [0.1, 0, 0.1],
    opacity: [0, 1, 0],
    transition: {
      delay: 0.5 + custom * 0.1,
      ease: "easeInOut",
      duration: 3,
      repeat: Infinity,
      repeatType: "loop",
    },
  }),

  exit: (custom: number) => ({
    y: "200%",
    transition: {
      delay: custom * 0.02,
      ease: "easeIn",
      duration: 0.25,
    },
  }),
};
