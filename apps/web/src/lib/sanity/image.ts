import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { sanityClient } from "./client";

const builder = imageUrlBuilder(sanityClient);
export function urlFor(source: Image | any) {
  return builder.image(source);
}
