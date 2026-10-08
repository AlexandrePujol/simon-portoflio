"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import {
  AnimatePresence,
  MotionValue,
  motion,
  useScroll,
  useTransform,
} from "motion/react";

import { createAlt } from "@/utils/helpers";
import { usePathname } from "next/navigation";
import { useWindowSize } from "@/hooks";

type Props = {
  src: string;
  aspectRatio: number;
  alt?: string;
  mobileSrc?: string;
  dominantColor?: string;
};

export const AnimPhoto = ({ alt, src, dominantColor, mobileSrc }: Props) => {
  const path = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();

  const isMobile = width && width < 640;

  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.style.backgroundColor = dominantColor ?? "#000000";
    }
  }, [ref.current, isLoaded]);

  return (
    <AnimatePresence mode="wait">
      <div
        ref={ref}
        key={path}
        className={`h-[50vh] flex justify-center items-center relative overflow-hidden sm:h-full sm:block`}
      >
        <motion.div
          exit={{ y: "100%" }}
          transition={{
            ease: "easeOut",
          }}
          data-scroll
          // data-scroll-speed="-0.5"
          className="relative h-full w-full translate-y-0"
        >
          <Image
            onLoad={handleLoad}
            fill
            alt={alt ?? createAlt(src)}
            src={isMobile ? mobileSrc || src : src}
            className={`transition-opacity h-full w-full duration-1000 scale-110 object-cover sm:translate-y-4 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
