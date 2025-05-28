import { getGithubLastEdit } from "fumadocs-core/server";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";

import { getMDXComponents } from "@/components/mdx-components";
import { app } from "@/lib/config";
import { source } from "@/providers";

export const generateStaticParams = async () => {
  return source.generateParams();
};

export const generateMetadata = async (props: {
  params: Promise<{ slug?: string[] }>;
}) => {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  return {
    title: `${app.name} - ${page.data.title}`,
    description: page.data.description,
  };
};

const Page = async (props: {
  params: Promise<{ slug?: string[] }>;
}) => {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        style: "clerk",
        single: false,
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
};

export default Page;
