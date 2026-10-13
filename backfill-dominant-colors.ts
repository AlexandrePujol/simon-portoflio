import { config } from "dotenv";
import { join } from "node:path";
import * as prismic from "@prismicio/client";

import prismicConfig from "./prismic.config.json";
import { photos as workPhotos } from "./src/data/photos";

config({ path: join(__dirname, ".env.local") });

/**
 * One-off script that backfills the dominant_color field added after the
 * homepage/work documents were first migrated, using the original hardcoded
 * values (recovered from git history for the homepage, still present in
 * src/data/photos.ts for /work). Updates the existing documents in place —
 * no new assets or documents are created. Run once with `pnpm backfill:colors`.
 */

const writeClient = prismic.createWriteClient(prismicConfig.repositoryName, {
  writeToken: process.env.PRISMIC_WRITE_TOKEN!,
});

const migration = prismic.createMigration();

// Recovered from src/pages/index.tsx before it was wired to Prismic
// (git show 8270270:src/pages/index.tsx), in the same order as the
// homepage gallery migration.
const HOMEPAGE_DOMINANT_COLORS: Record<string, string> = {
  "01_MY_GARDEN_IS_COOL.jpeg": "#282515",
  "02_MY_HOUSE_IS_A_TRIANGLE.jpeg": "#a29c9d",
  "03_GOOGLE_MAPS-ING.jpeg": "#413722",
  "72_LA_VIE_ET_SES_PLAISIRS.jpeg": "#789aa8",
  "09_SUPERMARKET.jpeg": "#9e382f",
  "47_LE_PIED_ET_LE_PARASOL.jpeg": "#decfc0",
  "48_LA_FILLE_ET_LE_PARAPLUIE.jpeg": "#19261d",
  "44_LEMONADE.jpeg": "#d2ac55",
};

const WORK_DOMINANT_COLORS: Record<string, string> = Object.fromEntries(
  workPhotos
    .filter((photo) => photo.dominantColor)
    .map((photo) => [photo.src.split("/").pop()!, photo.dominantColor]),
);

/** Finds a dominant color by matching the image URL against known filenames. */
function findDominantColor(
  url: string | null | undefined,
  colorsByFilename: Record<string, string>,
): string | null {
  if (!url) return null;
  const match = Object.entries(colorsByFilename).find(([filename]) =>
    url.includes(filename),
  );
  return match?.[1] ?? null;
}

async function backfillHomepage() {
  const doc = await writeClient.getSingle("homepage");

  doc.data.gallery = doc.data.gallery.map((item) => ({
    ...item,
    dominant_color: findDominantColor(item.photo.url, HOMEPAGE_DOMINANT_COLORS),
  })) as any;

  migration.updateDocument(doc);
}

async function backfillWork() {
  const doc = await writeClient.getSingle("work");

  for (const category of ["summer", "autumn", "winter", "spring"] as const) {
    doc.data[category] = doc.data[category].map((item) => ({
      ...item,
      dominant_color: findDominantColor(item.photo.url, WORK_DOMINANT_COLORS),
    })) as any;
  }

  migration.updateDocument(doc);
}

async function main() {
  await backfillHomepage();
  await backfillWork();

  await writeClient.migrate(migration, {
    reporter: (event) => console.log(event),
  });

  console.log(
    "\nUpdate release created. Review it in the Prismic dashboard before publishing.",
  );
}

main();
