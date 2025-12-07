import { createGenerator } from "fumadocs-typescript";
import { AutoTypeTable } from "fumadocs-typescript/ui";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";

import { ComponentPreview, InstallationTabs } from "@/components";

import type { MDXComponents } from "mdx/types";

const generator = createGenerator();

const getMDXComponents = (components?: MDXComponents): MDXComponents => {
  return {
    ...defaultMdxComponents,
    AutoTypeTable: (props) => (
      <AutoTypeTable {...props} generator={generator} />
    ),
    ComponentPreview,
    InstallationTabs,
    ...TabsComponents,
    ...components,
  };
};

export default getMDXComponents;
