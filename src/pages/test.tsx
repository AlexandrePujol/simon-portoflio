import React from "react";

import { rectangle, gridRectangle } from "@/components/work/SVGButtons/paths";
import { useMotionValue, animate } from "motion/react";
import { SVGMorph } from "@/components/atoms/SVGMorph";

export default function Test() {
  const progress = useMotionValue(0);

  const handleMouseEnter = () => {
    animate(progress, 0.999, {
      duration: 0.2,
      ease: "easeOut",
    });
  };

  const handleMouseLeave = () => {
    animate(progress, 0, {
      duration: 0.2,
      ease: "easeOut",
    });
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-[24px]">
        <svg
          id="Calque_1"
          data-name="Calque 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {rectangle.map((path, idx) => (
            <SVGMorph
              key={path}
              progress={progress}
              paths={[rectangle[idx], gridRectangle[idx], rectangle[idx]]}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
