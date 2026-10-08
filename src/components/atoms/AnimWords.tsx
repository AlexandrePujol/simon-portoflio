"use client";

import React from "react";
// Framer Motion
import { AnimatePresence, motion, Easing } from "motion/react";
import { usePathname } from "next/navigation";

interface Props {
  string?: string;
  delay?: number;
  ease?: Easing | undefined;
  duration?: number | undefined;
  stagger?: number | undefined;
  start?: boolean | undefined;
  fontWeight?: string | undefined;
  leading?: string | undefined;
  absolute?: boolean;
}

export const AnimatedWords = ({
  string,
  delay = 0.4,
  ease = [0.6, 0.01, -0.05, 0.95] as const,
  duration = 0.45,
  stagger = 0.02,
  start = true,
  fontWeight = "font-normal",
  absolute,
}: Props) => {
  const path = usePathname();
  const containerAnim = {
    hidden: {},
    show: {
      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
      },
    },
    exit: {
      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
      },
    },
  };

  const letterAnim = {
    hidden: {
      y: 400,
      transition: {
        ease: ease,
        duration: duration,
      },
    },
    show: {
      y: 0,
      transition: {
        ease: ease,
        duration: duration,
      },
    },
    exit: {
      y: -400,
      transition: {
        ease: ease,
        duration: duration,
      },
    },
  };

  const words = string?.split(" ");

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={path}
        id={string}
        variants={containerAnim}
        initial="hidden"
        animate={start ? "show" : "hidden"}
        exit="exit"
        className={`${absolute ? "absolute w-[100px]" : ""}
        overflow-hidden inline-block align-bottom`}
      >
        {words?.map((word) => (
          <>
            <span
              key={`${word}-${string}`}
              className="overflow-hidden inline-block"
            >
              <motion.span
                className={`${fontWeight} inline-block`}
                variants={letterAnim}
              >
                {word}
              </motion.span>
            </span>{" "}
          </>
        ))}
      </motion.span>
    </AnimatePresence>
  );
};
