import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { motion } from "framer-motion";

import { AnimatedLetters } from "@/components/atoms";
import { Container } from "@/components/molecules";
import { useCursorContext } from "@/context/CursorContext";
import simonPortrait from "@public/assets/photos/000_BIO.jpeg";
import { useMediaQuery } from "@/hooks";

export default function Contact() {
  const isMobile = useMediaQuery(640);
  const [isLoaded, setIsLoaded] = useState(false);
  const { setCursorType } = useCursorContext();

  const contactInfo = [
    {
      label: "gram",
      content: isMobile ? "@uma" : "@insta",
      href: "https://www.instagram.com/uma__simon/?hl=fr",
    },
    { label: "phone", content: "+32 472 77 12 42 " },
    {
      label: "mail",
      content: "simeychenne@gmail.com",
    },
  ];

  const handleMouseOver = () => {
    setCursorType("hover");
  };

  const handleMouseLeave = () => {
    setCursorType("pointer");
  };

  return (
    <Container className="bg-light h-[var(--fullScreen)]">
      <div className="flex flex-col justify-between gap-8 h-full pt-14 pb-8 sm:grid sm:grid-cols-5 sm:pt-16 sm:pb-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-full sm:col-span-3 bg-[#007E75]"
        >
          <Image
            src={simonPortrait}
            className={`object-cover transition-opacity duration-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            } `}
            alt="dans le miroir"
            placeholder="blur"
            onLoadingComplete={() => setIsLoaded(true)}
            fill
          />
        </motion.div>
        <div className="relative flex justify-center items-center sm:col-span-2">
          <ul className="w-full font-normal px-4 sm:w-auto">
            {contactInfo.map((item, idx) => (
              <li
                className="flex justify-between sm:text-center sm:block"
                key={item.label}
              >
                <div className="font-normal italic sm:hidden">{item.label}</div>
                {item.href ? (
                  <Link
                    href={item.href}
                    onMouseOver={handleMouseOver}
                    onMouseLeave={handleMouseLeave}
                  >
                    <AnimatedLetters string={item.content} delay={idx * 0.1} />
                  </Link>
                ) : (
                  <AnimatedLetters string={item.content} delay={idx * 0.1} />
                )}
              </li>
            ))}
          </ul>
          <div className="hidden sm:block absolute bottom-0 left-0 text-xs">
            Made by{" "}
            <a
              href="https://alexandrepujol.com/"
              onMouseOver={() => {
                setCursorType("hover");
              }}
              onMouseLeave={() => {
                setCursorType("pointer");
              }}
            >
              <span className="font-bold">@Alexandre Pujol</span>
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
