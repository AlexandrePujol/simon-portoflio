import { AnimatePresence, motion } from "motion/react";
import { useOverviewContext } from "../../../context/OverviewContext";
import { useCursorContext } from "../../../context/CursorContext";
import { MouseEvent, useState } from "react";
import { fadeOut, fadeTranslateOut } from "./anims";
import { SVGButtons } from "../SVGButtons";

import { PhotoInfo } from "@/types";

const groups = ["summer", "autumn", "winter", "spring"];

export const GroupElement = ({
  idx,
  handleClick,
  group,
  photoGroup,
  isActive,
}: any) => {
  const { setCursorType } = useCursorContext();

  const groupActive = photoGroup === group;

  // show the groupActive all the time and the other when isActive === true
  if (!isActive && !groupActive) return null;

  return (
    <motion.li
      key={group}
      variants={fadeTranslateOut}
      initial={groupActive ? "visible" : "hidden"}
      custom={idx}
      animate="visible"
      exit={groupActive ? "visible" : "hidden"}
      onMouseEnter={() => setCursorType("hover")}
      onMouseLeave={() => setCursorType("pointer")}
      onClick={(e) => {
        handleClick(group, e);
      }}
      className={
        groupActive ? "font-black order-1 cursor-pointer" : "cursor-pointer"
      }
    >
      {group}
    </motion.li>
  );
};
export const GroupSelector = ({ photoGroup, setPhotoGroup }: any) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = (group: string, e: MouseEvent) => {
    e.stopPropagation();
    if (group !== photoGroup) {
      if (isActive) {
        setIsActive(false);
        setPhotoGroup(group);
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <ul
        key={isActive.toString()}
        onMouseEnter={() => {
          if (!isActive) {
            setIsActive(true);
          }
        }}
        onMouseLeave={() => {
          if (isActive) {
            setIsActive(false);
          }
        }}
        className="flex flex-col items-end w-20 gap-1"
      >
        {groups.map((group, idx) => (
          <GroupElement
            key={group}
            idx={idx}
            group={group}
            isActive={isActive}
            photoGroup={photoGroup}
            handleClick={handleClick}
          />
        ))}
      </ul>
    </AnimatePresence>
  );
};

type WorkFooterProps = {
  infos: PhotoInfo;
  photoGroup: "summer" | "autumn" | "winter" | "spring";
  setPhotoGroup: (group: "summer" | "autumn" | "winter" | "spring") => void;
};

export const WorkFooter = ({
  infos,
  photoGroup,
  setPhotoGroup,
}: WorkFooterProps) => {
  const { setCursorType } = useCursorContext();
  const { isOverview, handleOverviewSwitch } = useOverviewContext();

  const handleOverview = (e: MouseEvent) => {
    e.stopPropagation();
    isOverview ? handleOverviewSwitch(false) : handleOverviewSwitch(true);
  };

  return (
    <div className="flex items-end relative left-0 top-0 h-0 z-[1] px-10 w-full mix-blend-difference">
      <AnimatePresence mode="popLayout">
        <div className="fixed bottom-4 left-10 right-10 flex justify-between items-end text-light">
          <motion.div
            key={infos.title}
            variants={fadeOut}
            initial="hidden"
            animate={isOverview ? "hidden" : "visible"}
            exit="hidden"
            className={`font-bold w-1/2 leading-[1.1] sm:width-auto pointer-events-none flex flex-col sm:block
            ${isOverview ? "pointer-events-none" : "pointer-events-auto"}`}
          >
            <span className="text-light">{infos.title} </span>
            <span className="font-light text-xs sm:ml-1">
              {infos.place} - {infos.date}
            </span>
          </motion.div>
          <div className="flex items-end gap-8 sm:flex-row sm:gap-40">
            <motion.div>
              <GroupSelector
                photoGroup={photoGroup}
                setPhotoGroup={setPhotoGroup}
              />
            </motion.div>
            <div
              onClick={handleOverview}
              onMouseEnter={() => setCursorType("hover")}
              onMouseLeave={() => setCursorType("pointer")}
              className="cursor-pointer ml-8 sm:ml-0"
            >
              <SVGButtons />
            </div>
          </div>
        </div>
      </AnimatePresence>
    </div>
  );
};
