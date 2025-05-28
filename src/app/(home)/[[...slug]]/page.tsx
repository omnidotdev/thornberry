import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";

import { getMDXComponents, GitHubLink } from "@/components";
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

interface Props {
  params: Promise<{ slug?: string[] }>;
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) notFound();

  const MDX = page.data.body;

  const path = `src/content/docs/${page.file.path}`;

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
      <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>
      <GitHubLink
        url={`https://github.com/${app.github.owner}/${app.github.repo}/blob/master/${path}`}
      />
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
};

export default Page;
