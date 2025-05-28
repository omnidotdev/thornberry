"use client";

import Link from "fumadocs-core/link";
import { FaGithub } from "react-icons/fa";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/registry/thornberry/components/button";

interface Props {
  url: string;
}

const GitHubLink = ({ url }: Props) => (
  <Link
    className={cn(
      buttonVariants({
        variant: "outline",
        size: "sm",
        className: "mb-8 w-fit gap-2",
      }),
    )}
    href={url}
  >
    <FaGithub /> View on GitHub
  </Link>
);

export default GitHubLink;
