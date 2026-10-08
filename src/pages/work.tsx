import { useEffect, useState } from "react";

import { Container } from "@/components/molecules";
import { Photo, WorkFooter } from "@/components/work";
import {
  OverviewProvider,
  useOverviewContext,
} from "@/context/OverviewContext";

import { photos } from "@/data/photos";

import { AnimatePresence, motion } from "motion/react";

import { gsap } from "gsap";
import { Flip } from "gsap/dist/Flip";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import { LocomotiveScrollContainer } from "@/components/molecules/SmoothScrollContainer";
import { ExtendedPhoto } from "@/types";

import { PhotoInfo } from "@/types";
import usePhotosDisplayed from "../hooks/usePhotosDisplayed";
import useUpdateTitle from "../hooks/useUpdateTitle";
import useFlipAnimation from "../hooks/useFlipAnimation";

gsap.registerPlugin(Flip);

export type Props = {
  photos: ExtendedPhoto[];
  photoGroup: "summer" | "autumn" | "winter" | "spring";
  setInfos: (infos: PhotoInfo) => void;
};

const Gallery = ({ photoGroup, setInfos }: Props) => {
  const { isOverview } = useOverviewContext();

  const photosDisplayed = usePhotosDisplayed({ photoGroup });
  setInfos(useUpdateTitle({ photosDisplayed }));

  const { setPhotoTarget } = useFlipAnimation();

  return (
    <AnimatePresence mode="popLayout">
      <div className="px-5">
        <div
          id="gallery-container"
          className={
            isOverview ? "grid-gallery" : "flex-gallery relative bg-light"
          }
        >
          {photosDisplayed.map((photo: ExtendedPhoto, idx: number) => (
            <div id={photo.alt} key={photo.alt}>
              <motion.div
                key={photoGroup}
                initial={{ opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0, y: "-150%" }}
                transition={{ duration: 0.2, delay: 0.5, ease: "easeOut" }}
              >
                <Photo
                  idx={idx}
                  photo={photo}
                  setPhotoTarget={setPhotoTarget}
                />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </AnimatePresence>
  );
};

export default function Work() {
  const [infos, setInfos] = useState<PhotoInfo>({
    title: "",
    place: "",
    date: "",
  });

  const [photoGroup, setPhotoGroup] = useState<
    "summer" | "autumn" | "winter" | "spring"
  >("summer");

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin);
    // updateAspectRatio(photos);
    // updateDominantColors(photos).then((photos) => {
    //   console.log(JSON.stringify(photos));
    // });
  }, []);

  if (!photos) return;

  return (
    <Container className="pt-0 bg-light relative">
      <OverviewProvider>
        <LocomotiveScrollContainer>
          <Gallery
            photos={photos}
            photoGroup={photoGroup}
            setInfos={setInfos}
          />
        </LocomotiveScrollContainer>
        <WorkFooter
          infos={infos}
          photoGroup={photoGroup}
          setPhotoGroup={setPhotoGroup}
        />
      </OverviewProvider>
    </Container>
  );
}
