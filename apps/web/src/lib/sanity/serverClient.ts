// apps/web/src/lib/sanity/serverClient.ts
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const token = process.env.SANITY_READ_TOKEN ?? process.env.SANITY_API_TOKEN;

export const sanityServerClient = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  useCdn: false,
  token, // 伺服器端唯讀 Token
});
