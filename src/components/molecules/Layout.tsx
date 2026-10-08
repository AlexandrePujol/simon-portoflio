import { Poppins } from "next/font/google";
import localFont from "next/font/local";

import { Navbar } from "@/components/organisms";
import Head from "next/head";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useWindowSize } from "@/hooks";
import CustomCursor from "./CustomCursor";
import { LoadingProvider } from "@/context/LoadingContext";

export const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const spartan = localFont({
  src: [
    {
      path: "../../../public/fonts/Spartan-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
});

type Props = {
  children: React.ReactNode;
};

export const metadata = {
  title: "Simon Eychenne",
  description: "Simon Eychenne,photographer portfolio",
};

export default function Layout({ children }: Props) {
  const path = usePathname();
  const { height } = useWindowSize();

  useEffect(() => {
    const screen = window.innerHeight;
    document.documentElement.style.setProperty("--fullScreen", screen + "px");
  }, [height]);

  return (
    <div id="App" className={`${poppins.className}`}>
      <Head>
        <title>Simon Eychenne</title>
        <meta
          name="description"
          content="Simon Eychenne,photographer portfolio"
        />
        <meta
          name="google-site-verification"
          content="Ve9FBLb0RALbz5JPjrEWjYLnPbwVI7qZPvsOOvJbSd8"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LoadingProvider>
        <header>
          <Navbar />
        </header>
        <CustomCursor />

        <AnimatePresence mode="wait">
          <motion.main
            key={path}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </LoadingProvider>
    </div>
  );
}
