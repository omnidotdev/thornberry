import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Button } from "../registry/thornberry/ui/button";
import { Input } from "../registry/thornberry/ui/input";

import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Button,
    Input,
    ...components,
  };
}