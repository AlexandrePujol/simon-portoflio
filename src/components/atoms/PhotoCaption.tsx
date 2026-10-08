"use client";

import React, { useRef } from "react";
import { Caption } from "@/types";

import { useInView, motion } from "motion/react";
import { AnimatedWords } from "./AnimWords";
import AnimatedLetters from "./AnimLetters";

export const PhotoCaption = ({
  idx = "01",
  title = "MY GARDEN IS COOL",
  place = "Canary Islands (ES)",
  date = "2021",
}: Caption) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      className="flex justify-between items-center sm:justify-start gap-2"
    >
      <h3 className="text-5xl whitespace-nowrap sm:text-6xl">
        <AnimatedLetters
          string={idx.padStart(2, "0")}
          start={isInView}
          fontWeight="font-bold"
          delay={0}
        ></AnimatedLetters>
      </h3>
      <div className="flex flex-col justify-between pt-0.5 overflow-hidden">
        <h4 className="text-lg text-end sm:text-start sm:text-xl overflow-hidden">
          <AnimatedWords string={title} start={isInView} delay={0.05} />
        </h4>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ ease: "easeOut", delay: 0.1 }}
          className="pb-0.5 text-end sm:text-start text-ellipsis overflow-hidden"
        >
          {date}, {place}.
        </motion.p>
      </div>
    </div>
  );
};
