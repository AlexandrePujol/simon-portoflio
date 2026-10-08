import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as prismic from "@prismicio/client";

import prismicConfig from "./prismic.config.json";
import { photos } from "./src/data/photos";

config({ path: join(__dirname, ".env.local") });

/**
 * One-off script that pushes the photos hardcoded in src/data/photos.ts into
 * the "work" (Gallery) document type, split into its four category groups
 * (summer, autumn, winter, spring), preserving each category's existing
 * order. Run once with `pnpm migrate:work`.
 *
 * This only prepares a migration release in Prismic; it does not publish it.
 * Review the release in the Prismic dashboard before publishing.
 */

const writeClient = prismic.createWriteClient(prismicConfig.repositoryName, {
  writeToken: process.env.PRISMIC_WRITE_TOKEN!,
});

const migration = prismic.createMigration();

const asset = (src: string, alt: string) =>
  migration.createAsset(
    readFileSync(join(__dirname, "public", src)),
    src.split("/").pop()!,
    { alt },
  );

const CATEGORIES = ["summer", "autumn", "winter", "spring"] as const;

const categoryGroups = Object.fromEntries(
  CATEGORIES.map((category) => {
    const items = photos
      .filter((photo) => photo.group === category)
      .map((photo) => ({
        photo: asset(photo.src, photo.alt),
        title: photo.capitalizedTitle,
        place: photo.place,
        date: photo.date,
      }));

    console.log(`${category}: ${items.length} photos`);

    return [category, items];
  }),
) as Record<(typeof CATEGORIES)[number], unknown>;

migration.createDocument(
  {
    type: "work",
    lang: "en-us",
    data: {
      // The migration types expect a non-empty tuple per group; these are
      // plain arrays of a known-fixed length, so the shape is correct at
      // runtime.
      summer: categoryGroups.summer as any,
      autumn: categoryGroups.autumn as any,
      winter: categoryGroups.winter as any,
      spring: categoryGroups.spring as any,
      slices: [],
      meta_title: null,
      meta_description: null,
      meta_image: undefined,
    },
  },
  "Gallery",
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
