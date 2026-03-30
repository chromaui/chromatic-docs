import type { GetStaticPaths } from "astro";
import { getAllDocs } from "../../utils/collections";
import { llmsDoc } from "../../utils/llms";

const siteUrl = "https://www.chromatic.com";
const baseUrl = import.meta.env.BASE_URL;
const SITE = `${siteUrl}${baseUrl}`;

export const getStaticPaths: GetStaticPaths = async () => {
  const allDocs = await getAllDocs({ includeNotInNavigation: true });

  return allDocs.map((doc) => ({
    params: { slug: doc.id },
    props: { doc },
  }));
};

export const GET = ({ props }: { props: { doc: any } }) => {
  return llmsDoc(props.doc, SITE);
};
