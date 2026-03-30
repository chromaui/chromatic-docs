import type { GetStaticPaths } from "astro";
import { getAllDocs } from "../../utils/collections";
import { llmsDoc, type DocEntry } from "../../utils/llms";

const siteUrl = import.meta.env.SITE ?? "https://chromatic.com/docs";
const baseUrl = import.meta.env.BASE_URL;
const SITE = new URL(baseUrl, siteUrl).href.replace(/\/$/, "");

export const getStaticPaths: GetStaticPaths = async () => {
  const allDocs = await getAllDocs({ includeNotInNavigation: true });

  return allDocs.map((doc) => ({
    params: { slug: doc.id },
    props: { doc },
  }));
};

export const GET = ({ props }: { props: { doc: DocEntry } }) => {
  return llmsDoc(props.doc, SITE);
};
