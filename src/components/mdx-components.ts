import defaultMdxComponents from "fumadocs-ui/mdx";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/thornberry/components/alert";
import { Button } from "@/registry/thornberry/components/button";
import { Input } from "@/registry/thornberry/components/input";

import type { MDXComponents } from "mdx/types";

export const getMDXComponents = (components?: MDXComponents): MDXComponents => {
  return {
    ...defaultMdxComponents,
    Alert,
    AlertDescription,
    AlertTitle,
    Button,
    Input,
    ...components,
  };
};
