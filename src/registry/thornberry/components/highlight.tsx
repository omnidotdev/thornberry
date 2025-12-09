import { Highlight as ArkHighlight } from "@ark-ui/react/highlight";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const Highlight = ({
  className,
  ...rest
}: ComponentProps<typeof ArkHighlight>) => (
  <ArkHighlight
    className={cn(
      "[&_mark]:rounded [&_mark]:bg-primary/20 [&_mark]:px-0.5 [&_mark]:text-foreground",
      className,
    )}
    {...rest}
  />
);

export { Highlight };
