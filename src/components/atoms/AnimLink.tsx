"use client";

import React from "react";
import Link from "next/link";

import { motion } from "motion/react";
import { useCursorContext } from "../../context/CursorContext";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
  href?: string;
};

const duration = 0.15;
const ease = "easeOut" as const;

const containerAnim = {
  normal: {},
  hovered: {
    transition: {
      staggerChildren: 0.02,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.02,
    },
  },
};

const letterAnim = {
  normal: {},
  hovered: {
    y: "-100%",
    transition: { ease, duration },
  },
};

const hiddenLetterAnim = {
  normal: { y: "100%" },
  hovered: { y: "100%", transition: { ease, duration } },
};

export const AnimLink = ({ children, href = "/" }: Props) => {
  const pathname = usePathname();
  const { setCursorType } = useCursorContext();
  const words = children?.toString().split(" ");
  const isCurrent = pathname === href;

  return (
    <Link
      href={href}
      scroll={false}
      className="cursor-pointer"
      onMouseOver={() => {
        setCursorType("hover");
      }}
      onMouseLeave={() => {
        setCursorType("pointer");
      }}
    >
      <motion.span
        variants={containerAnim}
        initial="normal"
        whileHover="hovered"
        exit="exit"
        key={children?.toString()}
        className={`overflow-hidden inline-block align-bottom ${
          isCurrent ? "font-bold" : ""
        }`}
      >
        {words?.map((word) => (
          <span key={word}>
            {[...word].map((letter, idx) => (
              <motion.span
                key={letter + idx}
                className="relative inline-block"
                variants={letterAnim}
              >
                {letter}
                <motion.span
                  key={letter + idx + "hidden"}
                  className="absolute left-0 bottom-0"
                  variants={hiddenLetterAnim}
                >
                  {letter}
                </motion.span>
              </motion.span>
            ))}{" "}
          </span>
        ))}
      </motion.span>
    </Link>
  );
};
