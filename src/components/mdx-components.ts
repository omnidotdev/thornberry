import defaultMdxComponents from "fumadocs-ui/mdx";

import { Accordion } from "@/registry/thornberry/components/accordion";
import { Button } from "@/registry/thornberry/components/button";
import { Input } from "@/registry/thornberry/components/input";

import type { MDXComponents } from "mdx/types";

export const getMDXComponents = (components?: MDXComponents): MDXComponents => {
  return {
    ...defaultMdxComponents,
    Accordion,
    Button,
    Input,
    ...components,
  };
};
