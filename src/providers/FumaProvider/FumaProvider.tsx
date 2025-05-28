import { docs } from "@/../.source";
import { app } from "@/lib/config";
import { loader } from "fumadocs-core/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider";

import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import type { ReactNode } from "react";

export const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
});

const baseOptions: BaseLayoutProps = {
  nav: {
    title: app.name,
  },
  githubUrl: app.githubUrl,
};

interface Props {
  children: ReactNode;
}

const FumaProvider = ({ children }: Props) => {
  return (
    <RootProvider>
      <DocsLayout tree={source.pageTree} {...baseOptions}>
        {children}
      </DocsLayout>
    </RootProvider>
  );
};

export default FumaProvider;
