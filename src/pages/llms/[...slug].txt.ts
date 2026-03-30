import type { GetStaticPaths } from "astro";
import { getAllCollections } from "../../utils/collections";
import { llmsDoc } from "../../utils/llms";

const SITE = "https://chromatic.com/docs";

export const getStaticPaths: GetStaticPaths = async () => {
  const collections = await getAllCollections();

  const allDocs = [
    ...collections.overview,
    ...collections.visualTests,
    ...collections.accessibilityTests,
    ...collections.interactionTests,
    ...collections.playwright,
    ...collections.cypress,
    ...collections.configuration,
    ...collections.modes,
    ...collections.snapshot,
    ...collections.turbosnap,
    ...collections.collaborate,
    ...collections.ci,
    ...collections.account,
    ...collections.guides,
    ...collections.troubleshooting.filter(
      ({ id }) => id !== "faq" && !id.startsWith("faq/"),
    ),
    ...collections.notInNavigation,
  ];

  return allDocs.map((doc) => ({
    params: { slug: doc.id },
    props: { doc },
  }));
};

export const GET = ({ props }: { props: { doc: any } }) => {
  return llmsDoc(props.doc, SITE);
};
