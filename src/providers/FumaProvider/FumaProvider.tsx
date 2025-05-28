import { loader } from "fumadocs-core/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider";

import { docs } from "@/../.source";
import { app } from "@/lib/config";

import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import type { PropsWithChildren } from "react";

export const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
});

const baseOptions: BaseLayoutProps = {
  nav: {
    title: app.name,
  },
  githubUrl: app.github.url,
};

const FumaProvider = ({ children }: PropsWithChildren) => (
  <RootProvider>
    <DocsLayout tree={source.pageTree} {...baseOptions}>
      {children}
    </DocsLayout>
  </RootProvider>
);

export default FumaProvider;
