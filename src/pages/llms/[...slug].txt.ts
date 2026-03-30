import type { GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { llmsDoc } from "../../utils/llms";

const SITE = "https://chromatic.com/docs";

export const getStaticPaths: GetStaticPaths = async () => {
  const overview = await getCollection("overview");
  const visualTests = await getCollection("visualTests");
  const accessibilityTests = await getCollection("accessibilityTests");
  const interactionTests = await getCollection("interactionTests");
  const playwright = await getCollection("playwright");
  const cypress = await getCollection("cypress");
  const configuration = await getCollection("configuration");
  const modes = await getCollection("modes");
  const snapshot = await getCollection("snapshot");
  const turbosnap = await getCollection("turbosnap");
  const collaborate = await getCollection("collaborate");
  const ci = await getCollection("ci");
  const account = await getCollection("account");
  const guides = await getCollection("guides");
  const troubleshooting = await getCollection("troubleshooting", ({ id }) => {
    return id !== "faq" && !id.startsWith("faq/");
  });
  const notInNavigation = await getCollection("notInNavigation");

  const allDocs = [
    ...overview,
    ...visualTests,
    ...accessibilityTests,
    ...interactionTests,
    ...playwright,
    ...cypress,
    ...configuration,
    ...modes,
    ...snapshot,
    ...turbosnap,
    ...collaborate,
    ...ci,
    ...account,
    ...guides,
    ...troubleshooting,
    ...notInNavigation,
  ];

  return allDocs.map((doc) => ({
    params: { slug: doc.id },
    props: { doc },
  }));
};

export const GET = ({ props }: { props: { doc: any } }) => {
  return llmsDoc(props.doc, SITE);
};
