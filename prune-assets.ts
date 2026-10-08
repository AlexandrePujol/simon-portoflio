import { config } from "dotenv";
import { createInterface } from "node:readline/promises";
import { join } from "node:path";
import * as prismic from "@prismicio/client";

import prismicConfig from "./prismic.config.json";

config({ path: join(__dirname, ".env.local") });

/**
 * Finds media library assets that no document references, in any ref
 * (master or pending releases), and optionally deletes them.
 *
 * Dry run (default): `pnpm prune:assets`
 * Delete for real:    `pnpm prune:assets -- --delete`
 */

const repositoryName = prismicConfig.repositoryName;
const token = process.env.PRISMIC_WRITE_TOKEN!;
const shouldDelete = process.argv.includes("--delete");

const assetApi = "https://asset-api.prismic.io/assets";

type Asset = {
  id: string;
  url: string;
  filename: string;
  size: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchAllAssets(): Promise<Asset[]> {
  const assets: Asset[] = [];
  let cursor: string | undefined;

  while (true) {
    const url = new URL(assetApi);
    url.searchParams.set("limit", "100");
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, repository: repositoryName },
    });
    if (!res.ok) {
      throw new Error(`Asset API GET failed: ${res.status} ${await res.text()}`);
    }

    const body = await res.json();
    assets.push(...body.items);

    if (!body.items.length || assets.length >= body.total) break;
    cursor = body.cursor;
    await sleep(1100);
  }

  return assets;
}

/** Recursively collects every Prismic CDN URL found anywhere in a value. */
function collectAssetUrls(value: unknown, found: Set<string>): void {
  if (typeof value === "string") {
    if (value.includes("prismic.io/") && value.includes(repositoryName)) {
      found.add(value);
    }
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectAssetUrls(v, found));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((v) => collectAssetUrls(v, found));
  }
}

async function fetchReferencedUrls(): Promise<Set<string>> {
  const client = prismic.createClient(repositoryName, { accessToken: token });
  const refs = await client.getRefs();

  const found = new Set<string>();

  for (const ref of refs) {
    const docs = await client.dangerouslyGetAll({ ref: ref.ref });
    for (const doc of docs) {
      collectAssetUrls(doc.data, found);
    }
  }

  return found;
}

async function confirm(question: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim().toLowerCase() === "yes";
}

async function main() {
  console.log("Fetching documents across all refs (master + releases)...");
  const referencedUrls = await fetchReferencedUrls();

  console.log("Fetching all media library assets...");
  const assets = await fetchAllAssets();

  const orphans = assets.filter(
    (asset) => ![...referencedUrls].some((url) => url.includes(asset.id)),
  );

  if (orphans.length === 0) {
    console.log(`\nNo orphans. All ${assets.length} assets are referenced by at least one document (published or draft).`);
    return;
  }

  const totalBytes = orphans.reduce((sum, a) => sum + a.size, 0);
  console.log(
    `\n${orphans.length} of ${assets.length} assets are unreferenced (${(totalBytes / 1024 / 1024).toFixed(1)} MB):\n`,
  );
  orphans.forEach((a) => console.log(`  ${a.id}  ${a.filename}`));

  if (!shouldDelete) {
    console.log("\nDry run only — nothing deleted. Re-run with `-- --delete` to remove these.");
    return;
  }

  const confirmed = await confirm(
    `\nType "yes" to permanently delete these ${orphans.length} assets: `,
  );
  if (!confirmed) {
    console.log("Aborted — nothing deleted.");
    return;
  }

  for (const asset of orphans) {
    const res = await fetch(`${assetApi}/${asset.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`, repository: repositoryName },
    });
    console.log(`${res.ok ? "Deleted" : `FAILED (${res.status})`}: ${asset.filename}`);
    await sleep(1100);
  }
}

main();
