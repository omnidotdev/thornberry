import { Fieldset as ArkFieldset } from "@ark-ui/react/fieldset";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const FieldsetProvider = ArkFieldset.RootProvider;
const FieldsetContext = ArkFieldset.Context;

const FieldsetRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkFieldset.Root>) => (
  <ArkFieldset.Root
    className={cn(
      "space-y-4 rounded-lg border border-border p-6",
      "data-[disabled]:opacity-50",
      className,
    )}
    {...rest}
  />
);

const FieldsetLegend = ({
  className,
  ...rest
}: ComponentProps<typeof ArkFieldset.Legend>) => (
  <ArkFieldset.Legend
    className={cn("font-semibold text-lg", className)}
    {...rest}
  />
);

const FieldsetHelperText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkFieldset.HelperText>) => (
  <ArkFieldset.HelperText
    className={cn("text-muted-foreground text-sm", className)}
    {...rest}
  />
);

const FieldsetErrorText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkFieldset.ErrorText>) => (
  <ArkFieldset.ErrorText
    className={cn("font-medium text-destructive text-sm", className)}
    {...rest}
  />
);

export {
  FieldsetProvider,
  FieldsetContext,
  FieldsetRoot,
  FieldsetLegend,
  FieldsetHelperText,
  FieldsetErrorText,
};
