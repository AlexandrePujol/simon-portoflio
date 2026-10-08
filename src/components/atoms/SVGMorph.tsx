import { interpolate } from "@siluat/flubber";
import { useTransform, MotionValue, motion } from "motion/react";

type Props = {
  progress: MotionValue;
  paths: string[];
};

export const SVGMorph = ({ progress, paths }: Props) => {
  const pathsIndexes = paths.map((_: string, idx: number) => idx);

  const path = useTransform(progress, pathsIndexes, paths, {
    mixer: (a, b) => interpolate(a, b, { maxSegmentLength: 0.1 }),
  });

  return <motion.path d={path} fill="#fff" />;
};
