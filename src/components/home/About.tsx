import React, { useRef } from "react";

import { AnimatedWords } from "../atoms";
import { useInView } from "motion/react";

type Props = {};

export const About = (props: Props) => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-8 md:gap-8">
      <div
        data-scroll
        data-scroll-speed="0.5"
        className="col-span-3 font-black text-4xl leading-[110%]"
      >
        <AnimatedWords
          delay={0}
          stagger={0.01}
          start={isInView}
          fontWeight="font-bold"
          string="What is supposed to be photogenic does not interest me as much as its
        inherent beauty."
        />
      </div>
      <div />

      <div
        data-scroll
        data-scroll-speed="0.5"
        className="mt-8 md:mt-0 md:col-span-2 text-justify flex items-end text-sm sm:text-lg"
      >
        <AnimatedWords
          delay={0}
          stagger={0.005}
          start={isInView}
          fontWeight="font-medium"
          string="It is more intriguing to me to offer a unique and original composition
          of something that is ultimately ordinary."
        />
      </div>
      <div
        data-scroll
        data-scroll-speed="0.5"
        className="col-span-2 text-justify flex items-end sm:text-lg"
      >
        <AnimatedWords
          delay={0}
          stagger={0.005}
          start={isInView}
          fontWeight="font-medium"
          string="Without pretension, I would like to pay tribute here to all objects, all
          bodies, all gestures, all buildings, and all the details that have
          inspired me when we crossed paths somewhere."
        />
      </div>
    </div>
  );
};
