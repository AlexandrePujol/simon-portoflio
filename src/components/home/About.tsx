import React, { useRef } from "react";

import { AnimatedWords } from "../atoms";
import { useInView } from "motion/react";
import { asText, type RichTextField } from "@prismicio/client";

type Props = {
  title: RichTextField;
  textLeft: RichTextField;
  textRight: RichTextField;
};

export const About = ({ title, textLeft, textRight }: Props) => {
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
          string={asText(title)}
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
          string={asText(textLeft)}
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
          string={asText(textRight)}
        />
      </div>
    </div>
  );
};
