"use client";

import { SignaturePad as ArkSignaturePad } from "@ark-ui/react/signature-pad";
import { Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/thornberry/components/button";

import type { ComponentProps } from "react";

const SignaturePadProvider = ArkSignaturePad.RootProvider;
const SignaturePadContext = ArkSignaturePad.Context;
const SignaturePadSegment = ArkSignaturePad.Segment;
const SignaturePadGuide = ArkSignaturePad.Guide;

const SignaturePadRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSignaturePad.Root>) => (
  <ArkSignaturePad.Root
    className={cn("flex flex-col gap-3", className)}
    {...rest}
  />
);

const SignaturePadLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSignaturePad.Label>) => (
  <ArkSignaturePad.Label
    className={cn("font-medium text-sm", className)}
    {...rest}
  />
);

const SignaturePadControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSignaturePad.Control>) => (
  <ArkSignaturePad.Control
    className={cn(
      "relative overflow-hidden rounded-md border bg-background focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
      className,
    )}
    {...rest}
  />
);

const SignaturePadClearTrigger = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkSignaturePad.ClearTrigger>) => (
  <ArkSignaturePad.ClearTrigger asChild {...rest}>
    <Button variant="outline" size="sm" className={className}>
      <Trash2 className="mr-2 h-4 w-4" />
      {children || "Clear"}
    </Button>
  </ArkSignaturePad.ClearTrigger>
);

const SignaturePadHiddenInput = ({
  ...rest
}: ComponentProps<typeof ArkSignaturePad.HiddenInput>) => (
  <ArkSignaturePad.HiddenInput {...rest} />
);

export {
  SignaturePadRoot,
  SignaturePadLabel,
  SignaturePadControl,
  SignaturePadSegment,
  SignaturePadGuide,
  SignaturePadClearTrigger,
  SignaturePadHiddenInput,
  SignaturePadProvider,
  SignaturePadContext,
};
