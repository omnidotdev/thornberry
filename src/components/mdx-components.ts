import defaultMdxComponents from "fumadocs-ui/mdx";

import { Button } from "@/registry/thornberry/components/button";
import { Input } from "@/registry/thornberry/components/input";

import type { MDXComponents } from "mdx/types";

export const getMDXComponents = (components?: MDXComponents): MDXComponents => {
  return {
    ...defaultMdxComponents,
    Button,
    Input,
    ...components,
  };
};
