import browserCollections from "fumadocs-mdx:collections/browser";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import defaultMdxComponents from "fumadocs-ui/mdx";

import GitHubLink from "@/components/github-link";
import InstallationTabs from "@/components/installation-tabs";
import app from "@/lib/config/app.config";
import source from "@/lib/source";

/**
 * Splat page.
 */
const Page = () => {
  const { data, slugs } = Route.useLoaderData();
  const { pageTree } = useFumadocsLoader(data);

  const Content = clientLoader.getComponent(data.path);

  return (
    <DocsLayout
      nav={{
        title: app.name,
      }}
      githubUrl={app.github.url}
      tree={pageTree}
    >
      <Content />
    </DocsLayout>
  );
};

/**
 * Splat route.
 */
export const Route = createFileRoute("/$")({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split("/") ?? [];

    const data = await serverLoader({ data: slugs });

    await clientLoader.preload(data.path);

    return { data, slugs };
  },
  head: ({ loaderData }) => {
    const slugs = loaderData?.slugs;

    const currentSegment = slugs?.length
      ? slugs
          .at(-1)
          ?.split("-")
          .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
          .join(" ")
      : app.name;

    return {
      meta: [
        {
          title: currentSegment ? `${app.name} - ${currentSegment}` : app.name,
        },
      ],
    };
  },
});

const serverLoader = createServerFn({ method: "GET" })
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);

    if (!page) throw notFound();

    return {
      path: page.path,
      pageTree: await source.serializePageTree(source.getPageTree()),
    };
  });

const clientLoader = browserCollections.docs.createClientLoader({
  component: ({ toc, frontmatter, default: MDX, path }) => (
    <DocsPage
      toc={toc}
      tableOfContent={{
        style: "clerk",
        single: false,
      }}
    >
      <DocsTitle>{frontmatter.title}</DocsTitle>

      <DocsDescription className="mb-0">
        {frontmatter.description}
      </DocsDescription>

      <GitHubLink
        url={`https://github.com/${app.github.owner}/${app.github.repo}/blob/master/${path}`}
      />

      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            InstallationTabs,
            ...TabsComponents,
          }}
        />
      </DocsBody>
    </DocsPage>
  ),
});
