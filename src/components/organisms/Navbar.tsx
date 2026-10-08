"use client";

import React, { useEffect, useState } from "react";

import { AnimLink } from "../atoms";
import { Container } from "../molecules";
import { motion, Variants } from "motion/react";
import { usePathname } from "next/navigation";
import { useLoadingContext } from "@/context/LoadingContext";
import { SVGButtons } from "../work";

type NavLink = {
  href: string;
  title: string;
};

type Props = {
  navLinks: NavLink[];
  isMenuOpen: boolean;
  setIsMenuOpen: (e: boolean) => void;
};

const containerAnim: Variants = {
  hidden: {
    transition: {
      staggerChildren: 0.05,
      ease: "easeOut",
    },
  },
  shown: {
    transition: {
      staggerChildren: 0.05,
      ease: "easeIn",
    },
  },
};

const linkAnim = {
  hidden: { y: "-100%" },
  shown: { y: 0 },
};

const navLinks = [
  { href: "/", title: "home" },
  { href: "/work", title: "gallery" },
  { href: "/contact", title: "contact" },
];

interface BurgerButtonProps {
  isMenuOpen: boolean;
}

const BurgerButton = ({ isMenuOpen }: BurgerButtonProps) => {
  const burgerButtonAnim = {
    open: { rotate: 0, y: 0 },
    close: (custom: number) => ({
      y: custom * 3,
      rotate: custom * 45,
      ease: [0.3, 0.01, -0.05, 0.95],
    }),
  };

  return (
    <div className="z-10">
      <motion.div
        custom={1}
        variants={burgerButtonAnim}
        animate={isMenuOpen ? "close" : "open"}
        className="w-6 h-[2px] mt-1 bg-black"
      ></motion.div>
      <motion.div
        custom={-1}
        variants={burgerButtonAnim}
        animate={isMenuOpen ? "close" : "open"}
        className="w-6 h-[2px] mt-1 bg-black"
      ></motion.div>
    </div>
  );
};

export const Menu = ({ navLinks, isMenuOpen, setIsMenuOpen }: Props) => {
  const path = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [path]);

  return (
    <motion.div
      initial={{ y: "-100%" }}
      animate={{ y: isMenuOpen ? 0 : "-100%" }}
      transition={{ ease: "easeOut" }}
      className="fixed sm:hidden top-0 left-0 right-0 bottom-0 bg-light z-30"
    >
      <Container className="py-10 flex flex-col justify-between h-full">
        <div
          className="cursor-pointer flex justify-end"
          onClick={() => {
            setIsMenuOpen(false);
          }}
        >
          <BurgerButton isMenuOpen={true} />
        </div>
        <ul className="flex flex-col gap-6">
          {navLinks.map((navLink, idx) => (
            <motion.li
              key={idx}
              variants={linkAnim}
              className="text-xl font-bold"
            >
              <AnimLink href={navLink.href}>{navLink.title}</AnimLink>
            </motion.li>
          ))}
        </ul>
      </Container>
    </motion.div>
  );
};

export const Navbar = () => {
  const path = usePathname();
  const { isLoaded } = useLoadingContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollDir, setScrollDir] = useState<"up" | "down">("up");

  const handleWheel = (e: WheelEvent) => {
    if (e.deltaY > 0) {
      setScrollDir("down");
    } else {
      setScrollDir("up");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const container = document.querySelector("body");
    container?.addEventListener("wheel", handleWheel);

    return document.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setScrollDir("up");
    }
  }, [isLoaded]);

  if (!isLoaded && path === "/") return null;

  return (
    <Container className="fixed left-0 right-0 z-10 pt-4">
      <motion.ul
        initial="hidden"
        animate={scrollDir === "down" ? "hidden" : "shown"}
        exit="hidden"
        variants={containerAnim}
        className="hidden overflow-hidden sm:flex justify-end gap-14 font-semi-bold"
      >
        {navLinks.map((navLink, idx) => (
          <motion.li key={idx} variants={linkAnim}>
            <AnimLink href={navLink.href}>{navLink.title}</AnimLink>
          </motion.li>
        ))}
      </motion.ul>
      {/*  burger button */}
      <ul
        onClick={toggleMenu}
        className="flex sm:hidden flex-col justify-center items-end h-6 gap-1"
      >
        <li className="w-5 h-[1px] bg-black rounded"></li>
        <li className="w-5 h-[1px] bg-black rounded"></li>
      </ul>
      {/* menu for mobile */}
      <Menu
        navLinks={navLinks}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
    </Container>
  );
};
