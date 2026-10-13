import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { asLink } from "@prismicio/client";

import { motion } from "motion/react";

import { AnimatedLetters } from "@/components/atoms";
import { Container } from "@/components/molecules";
import { useCursorContext } from "@/context/CursorContext";
import { createClient } from "@/prismicio";

export const getStaticProps = async ({
  previewData,
}: GetStaticPropsContext) => {
  const client = createClient({ previewData });
  const page = await client.getSingle("contact");

  return { props: { page } };
};

export default function Contact({
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { setCursorType } = useCursorContext();

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
          style={{ backgroundColor: page.data.dominant_color ?? "#007E75" }}
          className="relative h-full sm:col-span-3"
        >
          <Image
            src={page.data.portrait.url ?? ""}
            className={`object-cover transition-opacity duration-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            } `}
            alt={page.data.portrait.alt ?? "dans le miroir"}
            onLoadingComplete={() => setIsLoaded(true)}
            fill
          />
        </motion.div>
        <div className="relative flex justify-center items-center sm:col-span-2">
          <ul className="w-full font-normal px-4 sm:w-auto">
            {page.data.contact_info.map((item, idx) => {
              const href = asLink(item.link);

              return (
                <li
                  className="flex justify-between sm:text-center sm:block"
                  key={item.label}
                >
                  <div className="font-normal italic sm:hidden">
                    {item.label}
                  </div>
                  {href ? (
                    <Link
                      href={href}
                      onMouseOver={handleMouseOver}
                      onMouseLeave={handleMouseLeave}
                    >
                      <AnimatedLetters
                        string={item.content ?? ""}
                        delay={idx * 0.1}
                      />
                    </Link>
                  ) : (
                    <AnimatedLetters
                      string={item.content ?? ""}
                      delay={idx * 0.1}
                    />
                  )}
                </li>
              );
            })}
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
