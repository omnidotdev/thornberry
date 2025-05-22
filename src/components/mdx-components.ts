import defaultMdxComponents from "fumadocs-ui/mdx";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { MDXComponents } from "mdx/types";

export const getMDXComponents = (components?: MDXComponents): MDXComponents => {
  return {
    ...defaultMdxComponents,
    Button,
    Input,
    ...components,
  };
};
