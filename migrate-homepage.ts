import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as prismic from "@prismicio/client";

import prismicConfig from "./prismic.config.json";

config({ path: join(__dirname, ".env.local") });

/**
 * One-off script that pushes the homepage content hardcoded in
 * src/pages/index.tsx, src/components/home/{HeroHome,About,Outro}.tsx into
 * the "homepage" document type. Run once with `pnpm migrate:homepage`.
 *
 * This only prepares a migration release in Prismic; it does not publish it.
 * Review the release in the Prismic dashboard before publishing.
 */

const writeClient = prismic.createWriteClient(prismicConfig.repositoryName, {
  writeToken: process.env.PRISMIC_WRITE_TOKEN!,
});

const migration = prismic.createMigration();

const asset = (path: string, alt: string) =>
  migration.createAsset(readFileSync(join(__dirname, "public", path)), path.split("/").pop()!, {
    alt,
  });

const paragraph = (text: string): prismic.RichTextField => [
  { type: "paragraph", text, spans: [] },
];

/** Builds a single-paragraph rich text field, bolding each exact substring in `bold`. */
const paragraphWithBold = (text: string, bold: string[]): prismic.RichTextField => {
  const spans = bold.map((part) => {
    const start = text.indexOf(part);
    if (start === -1) {
      throw new Error(`Bold text "${part}" not found in "${text}"`);
    }
    return { type: "strong" as const, start, end: start + part.length };
  });

  return [{ type: "paragraph", text, spans }];
};

type GalleryItem = {
  path: string;
  alt: string;
  title: string;
  place: string;
  date: string;
  blurbText?: string;
  blurbBold?: string[];
};

const gallery: GalleryItem[] = [
  {
    path: "assets/photos/home/01_MY_GARDEN_IS_COOL.jpeg",
    alt: "01_MY_GARDEN_IS_COOL",
    title: "MY GARDEN IS COOL",
    place: "Canary Islands (ES)",
    date: "2021",
  },
  {
    path: "assets/photos/home/02_MY_HOUSE_IS_A_TRIANGLE.jpeg",
    alt: "02_MY_HOUSE_IS_A_TRIANGLE",
    title: "MY HOUSE IS A TRIANGLE",
    place: "Vancouver (CA)",
    date: "2020",
  },
  {
    path: "assets/photos/home/03_GOOGLE_MAPS-ING.jpeg",
    alt: "03_GOOGLE_MAPS-ING",
    title: "GOOGLE MAPS-ING",
    place: "Honolulu (US)",
    date: "2020",
    blurbText:
      "Tourists taking a break from the rain close by the genuine pink building.",
    blurbBold: ["Tourists taking a break from", "pink building"],
  },
  {
    path: "assets/photos/home/72_LA_VIE_ET_SES_PLAISIRS.jpeg",
    alt: "72_LA_VIE_ET_SES_PLAISIRS",
    title: "LA VIE ET SES PLAISIRS",
    place: "Saint-Tropez (FR)",
    date: "2022",
  },
  {
    path: "assets/photos/home/09_SUPERMARKET.jpeg",
    alt: "09_SUPERMARKET",
    title: "SUPERMARKET",
    place: "Provence-Alpes-Côte d’Azur (FR)",
    date: "2021",
  },
  {
    path: "assets/photos/home/47_LE_PIED_ET_LE_PARASOL.jpeg",
    alt: "47_LE_PIED_ET_LE_PARASOL",
    title: "LE PIED ET LE PARASOL",
    place: "Victoria (CA)",
    date: "2020",
  },
  {
    path: "assets/photos/home/48_LA_FILLE_ET_LE_PARAPLUIE.jpeg",
    alt: "48_LA_FILLE_ET_LE_PARAPLUIE",
    title: "LA FILLE ET LE PARAPLUIE",
    place: "Paris (FR)",
    date: "2022",
  },
  {
    path: "assets/photos/summer/44_LEMONADE.jpeg",
    alt: "44_LEMONADE",
    title: "LEMONADE",
    place: "Amsterdam (NL)",
    date: "2022",
    blurbText: "The couch waits all day for you to come home.",
    blurbBold: ["The couch", "to come home"],
  },
];

migration.createDocument(
  {
    type: "homepage",
    lang: "en-us",
    data: {
      hero_image: asset(
        "assets/photos/home/00_ACCUEIL.jpeg",
        "house in a green field",
      ),
      hero_tagline: paragraph(
        "Through photography, I aim to isolate elements from their primary function in order to reveal their aesthetic dimension.",
      ),
      about_title: paragraph(
        "What is supposed to be photogenic does not interest me as much as its inherent beauty.",
      ),
      about_text_left: paragraph(
        "It is more intriguing to me to offer a unique and original composition of something that is ultimately ordinary.",
      ),
      about_text_right: paragraph(
        "Without pretension, I would like to pay tribute here to all objects, all bodies, all gestures, all buildings, and all the details that have inspired me when we crossed paths somewhere.",
      ),
      // The migration types expect a non-empty tuple; `gallery` is a plain
      // array of a known-fixed length, so the shape is correct at runtime.
      gallery: gallery.map((item) => ({
        photo: asset(item.path, item.alt),
        title: item.title,
        place: item.place,
        date: item.date,
        blurb: item.blurbText
          ? paragraphWithBold(item.blurbText, item.blurbBold ?? [])
          : [],
      })) as any,
      outro_image: asset(
        "assets/photos/spring/26_REST_AREA.jpeg",
        "Outro background photo",
      ),
      slices: [],
      meta_title: null,
      meta_description: null,
      meta_image: undefined,
    },
  },
  "Homepage",
);

async function main() {
  await writeClient.migrate(migration, {
    reporter: (event) => console.log(event),
  });

  console.log(
    "\nMigration release created. Review it in the Prismic dashboard before publishing.",
  );
}

main();
