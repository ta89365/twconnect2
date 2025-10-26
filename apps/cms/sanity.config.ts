import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "default",
  title: "TW Connect CMS",
  projectId: "ki3tylfo",   // ← 保留你現有的 projectId
  dataset: "production",    // ← 保留你現有的 dataset 名稱
  apiVersion: "2024-01-01",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
