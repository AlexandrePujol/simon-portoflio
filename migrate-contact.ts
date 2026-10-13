import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as prismic from "@prismicio/client";

import prismicConfig from "./prismic.config.json";

/**
 * One-off script that pushes the contact page content hardcoded in
 * src/pages/contact.tsx (portrait photo + contact info list) into the
 * "contact" document type. Run once with `pnpm migrate:contact`.
 *
 * This only prepares a migration release in Prismic; it does not publish it.
 * Review the release in the Prismic dashboard before publishing.
 */

config({ path: join(__dirname, ".env.local") });

const writeClient = prismic.createWriteClient(prismicConfig.repositoryName, {
  writeToken: process.env.PRISMIC_WRITE_TOKEN!,
});

const migration = prismic.createMigration();

const asset = (path: string, alt: string) =>
  migration.createAsset(
    readFileSync(join(__dirname, "public", path)),
    path.split("/").pop()!,
    { alt },
  );

const webLink = (url: string): prismic.LinkField => ({
  link_type: "Web",
  url,
});

migration.createDocument(
  {
    type: "contact",
    lang: "en-us",
    data: {
      portrait: asset("assets/photos/000_BIO.jpeg", "dans le miroir"),
      contact_info: [
        {
          label: "gram",
          content: "@insta",
          link: webLink("https://www.instagram.com/uma__simon/?hl=fr"),
        },
        {
          label: "phone",
          content: "+32 472 77 12 42 ",
          link: { link_type: "Any" },
        },
        {
          label: "mail",
          content: "simeychenne@gmail.com",
          link: { link_type: "Any" },
        },
      ] as any,
      dominant_color: "#5c958f",
      slices: [],
      meta_title: null,
      meta_description: null,
      meta_image: undefined,
    },
  },
  "Contact",
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
