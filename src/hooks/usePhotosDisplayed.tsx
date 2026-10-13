import { ExtendedPhoto } from "@/types";
import React, { useEffect, useState } from "react";
import { useLocomotiveScroll } from "react-locomotive-scroll";

type Props = {
  photos: ExtendedPhoto[];
  photoGroup: "summer" | "autumn" | "winter" | "spring";
};

const usePhotosDisplayed = ({ photos, photoGroup }: Props) => {
  const { scroll } = useLocomotiveScroll();
  const [photosDisplayed, setPhotosDisplayed] = useState<ExtendedPhoto[]>([]);

  useEffect(() => {
    if (!photos) return;
    const photosDisplayed = photos.filter(
      (photo: ExtendedPhoto) => photo.group === photoGroup
    );
    // go back to the top of the page
    setPhotosDisplayed(photosDisplayed);
    scroll?.scrollTo(0, 0, 0);
  }, [photoGroup]);

  return photosDisplayed;
};

export default usePhotosDisplayed;
