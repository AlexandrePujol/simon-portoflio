import { useEffect, useRef, useState } from "react";
import { useLocomotiveScroll } from "react-locomotive-scroll";

import { ExtendedPhoto, PhotoInfo } from "@/types";
import { useWindowSize } from "@/hooks";

type Props = {
  photosDisplayed: ExtendedPhoto[];
};

const useUpdateTitle = ({ photosDisplayed }: Props) => {
  const { scroll } = useLocomotiveScroll();

  const [infos, setInfos] = useState<PhotoInfo>({
    title: "",
    place: "",
    date: "",
  });

  // Scroll events fire every frame; only push new infos when the photo
  // actually changes so the footer doesn't re-render ~60 times a second.
  const currentIdx = useRef(0);

  const updateInfos = (idx: number) => {
    if (idx === currentIdx.current) return;
    currentIdx.current = idx;

    setInfos({
      title: photosDisplayed[idx]?.capitalizedTitle,
      place: photosDisplayed[idx]?.place,
      date: photosDisplayed[idx]?.date,
    });
  };

  const handleSmoothScroll = (e: any) => {
    updateInfos(
      Math.round((e.scroll.y / e.limit.y) * (photosDisplayed.length - 1))
    );
  };

  const handleWindowScroll = () => {
    updateInfos(
      Math.round(
        (window.scrollY / document.body.scrollHeight) *
          (photosDisplayed.length - 1)
      )
    );
  };

  useEffect(() => {
    currentIdx.current = 0;
    setInfos({
      title: photosDisplayed[0]?.capitalizedTitle,
      place: photosDisplayed[0]?.place,
      date: photosDisplayed[0]?.date,
    });
  }, [photosDisplayed]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      window.addEventListener("scroll", handleWindowScroll);
    } else if (scroll) {
      scroll.on("scroll", handleSmoothScroll);
    }

    return () => {
      if (scroll) {
        scroll.off("scroll", handleSmoothScroll);
      }
      window.removeEventListener("scroll", handleWindowScroll);
    };
    // Clean up the event listener when the component unmounts or photosDisplayed changes
    return () => {
      if (scroll) {
        scroll.off("scroll", handleSmoothScroll);
      }
    };
  }, [scroll, photosDisplayed]);

  return infos;
};

export default useUpdateTitle;
