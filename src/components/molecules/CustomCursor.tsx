import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Context
import { useCursorContext } from "@/context/CursorContext";
import AnimatedLetters from "../atoms/AnimLetters";
import { useLoadingContext } from "@/context/LoadingContext";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const { cursorType } = useCursorContext();
  const { isLoaded } = useLoadingContext();

  // Raw mouse position, updated without triggering a React re-render.
  const mouseX = useMotionValue(-20);
  const mouseY = useMotionValue(-20);
  // Spring-smoothed position: framer-motion drives this off its own RAF loop
  // instead of a CSS transition fighting the per-mousemove transform writes,
  // which is what was causing the Safari-only glitching.
  const x = useSpring(mouseX, { damping: 32, stiffness: 500, mass: 0.2 });
  const y = useSpring(mouseY, { damping: 32, stiffness: 500, mass: 0.2 });

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX - 10);
      mouseY.set(event.clientY - 10);
    };

    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      id="CustomCursor" // had to use css for styling here --> base.scss
      ref={cursorRef}
      className={cursorType}
      style={{
        x,
        y,
        opacity: isLoaded || path !== "/" ? 1 : 0,
      }}
      animate={{ scale: cursorType === "hover" ? 0.5 : 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 400 }}
    >
      {cursorType === "cta" && (
        <AnimatedLetters key="cta" delay={0} string="SEE ALL" />
      )}
    </motion.div>
  );
}
