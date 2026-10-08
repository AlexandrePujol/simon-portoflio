import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { PrismicRichText } from "@prismicio/react";

import {
  HeroHome,
  GridTwo,
  OneWCaption,
  TwoShifted,
  Outro,
  About,
} from "@/components/home";

import { Container, LocomotiveScrollContainer } from "@/components/molecules";
import { Loader } from "@/components/organisms";
import { Photo } from "@/types";
import { createClient } from "@/prismicio";
import { createAlt } from "@/utils/helpers";

// TO DO
// [] rearrange the layout on mobile
// [] when overview scroll malfunctions (no bug on live version ...)
// [] try and see if snapping isn't possible

const boldSerializer = {
  strong: ({ children }: { children: React.ReactNode }) => (
    <span className="font-bold">{children}</span>
  ),
};

export const getStaticProps = async ({
  previewData,
}: GetStaticPropsContext) => {
  const client = createClient({ previewData });
  const page = await client.getSingle("homepage");

  return { props: { page } };
};

export default function Home({
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const photos: Photo[] = page.data.gallery.map((item, idx) => ({
    src: item.photo.url ?? "",
    alt: item.photo.alt ?? createAlt(item.photo.url ?? ""),
    caption: {
      idx: String(idx + 1),
      title: item.title ?? "",
      place: item.place ?? "",
      date: item.date ?? "",
    },
    aspectRatio: item.photo.dimensions
      ? item.photo.dimensions.width / item.photo.dimensions.height
      : undefined,
  }));

  if (!photos.length) return null;

  return (
    <LocomotiveScrollContainer>
      <Loader />

      <Container className="pt-6">
        <div className="relative flex flex-col items gap-24 sm:gap-56 pb-6 bg-light">
          <HeroHome image={page.data.hero_image} tagline={page.data.hero_tagline} />
          <About
            title={page.data.about_title}
            textLeft={page.data.about_text_left}
            textRight={page.data.about_text_right}
          />

          <GridTwo firstPhoto={photos[0]} secondPhoto={photos[1]} />
          <OneWCaption photo={photos[2]}>
            <PrismicRichText
              field={page.data.gallery[2]?.blurb ?? []}
              components={boldSerializer}
            />
          </OneWCaption>
          <TwoShifted firstPhoto={photos[3]} secondPhoto={photos[4]} />
          <TwoShifted firstPhoto={photos[6]} secondPhoto={photos[5]} inverted />
          <OneWCaption photo={photos[7]}>
            <PrismicRichText
              field={page.data.gallery[7]?.blurb ?? []}
              components={boldSerializer}
            />
          </OneWCaption>
        </div>
      </Container>
      <Outro image={page.data.outro_image} />
    </LocomotiveScrollContainer>
  );
}
