import { useEffect, useState } from "react";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";

import { Container } from "@/components/molecules";
import { Photo, WorkFooter } from "@/components/work";
import {
  OverviewProvider,
  useOverviewContext,
} from "@/context/OverviewContext";

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
import { createClient } from "@/prismicio";
import { createAlt } from "@/utils/helpers";

gsap.registerPlugin(Flip);

const CATEGORIES = ["summer", "autumn", "winter", "spring"] as const;
type Category = (typeof CATEGORIES)[number];

export const getStaticProps = async ({
  previewData,
}: GetStaticPropsContext) => {
  const client = createClient({ previewData });
  const page = await client.getSingle("work");

  return { props: { page } };
};

type Props = {
  photos: ExtendedPhoto[];
  photoGroup: Category;
  setInfos: (infos: PhotoInfo) => void;
};

const Gallery = ({ photos, photoGroup, setInfos }: Props) => {
  const { isOverview } = useOverviewContext();

  const photosDisplayed = usePhotosDisplayed({ photos, photoGroup });
  const infos = useUpdateTitle({ photosDisplayed });
  useEffect(() => setInfos(infos), [infos, setInfos]);

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
            <div id={photo.id} key={photo.id}>
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

export default function Work({
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [infos, setInfos] = useState<PhotoInfo>({
    title: "",
    place: "",
    date: "",
  });

  const [photoGroup, setPhotoGroup] = useState<Category>("summer");

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin);
  }, []);

  const photos: ExtendedPhoto[] = CATEGORIES.flatMap((category) =>
    page.data[category].map((item) => ({
      id: item.photo.id ?? item.photo.url ?? "",
      src: item.photo.url ?? "",
      alt: item.photo.alt ?? createAlt(item.photo.url ?? ""),
      dominantColor: item.dominant_color ?? undefined,
      aspectRatio: item.photo.dimensions
        ? item.photo.dimensions.width / item.photo.dimensions.height
        : 1,
      capitalizedTitle: item.title ?? "",
      place: item.place ?? "",
      date: item.date ?? "",
      group: category,
    })),
  );

  if (!photos.length) return null;

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
