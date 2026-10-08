import React, { useEffect } from "react";
import { rectangle, gridRectangle } from "./paths";

import { animate, useMotionValue } from "motion/react";
import { SVGMorph } from "@/components/atoms";
import { useOverviewContext } from "@/context/OverviewContext";

export const SVGButtons = () => {
  const progress = useMotionValue(0);
  const { isOverview } = useOverviewContext();

  const rectangleProgress = 0;
  const gridRectangleProgress = 0.999;

  const handleMouseEnter = () => {
    animate(progress, isOverview ? rectangleProgress : gridRectangleProgress, {
      duration: 0.2,
      ease: "easeOut",
    });
  };

  const handleMouseLeave = () => {
    animate(progress, isOverview ? gridRectangleProgress : rectangleProgress, {
      duration: 0.2,
      ease: "easeOut",
    });
  };

  useEffect(() => {
    if (!isOverview) {
      progress.set(rectangleProgress);
    } else {
      progress.set(gridRectangleProgress);
    }
  }, [isOverview]);

  return (
    <div className="w-[20px] pb-1 pointer-events-auto">
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
  );
};
