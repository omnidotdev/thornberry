"use client";

import { QrCode as ArkQrCode } from "@ark-ui/react/qr-code";
import { Download } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/thornberry/components/button";

import type { ComponentProps } from "react";

const QrCodeProvider = ArkQrCode.RootProvider;
const QrCodeContext = ArkQrCode.Context;
const QrCodePattern = ArkQrCode.Pattern;

const QrCodeRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkQrCode.Root>) => (
  <ArkQrCode.Root className={cn("flex flex-col gap-4", className)} {...rest} />
);

const QrCodeFrame = ({
  className,
  ...rest
}: ComponentProps<typeof ArkQrCode.Frame>) => (
  <ArkQrCode.Frame
    className={cn(
      "inline-flex items-center justify-center overflow-hidden rounded-md border bg-background p-4",
      className,
    )}
    {...rest}
  />
);

const QrCodeOverlay = ({
  className,
  ...rest
}: ComponentProps<typeof ArkQrCode.Overlay>) => (
  <ArkQrCode.Overlay
    className={cn(
      "absolute inset-0 flex items-center justify-center bg-background/80",
      className,
    )}
    {...rest}
  />
);

const QrCodeDownloadTrigger = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkQrCode.DownloadTrigger>) => (
  <ArkQrCode.DownloadTrigger asChild {...rest}>
    <Button variant="outline" size="sm" className={className}>
      <Download className="mr-2 h-4 w-4" />
      {children || "Download"}
    </Button>
  </ArkQrCode.DownloadTrigger>
);

export {
  QrCodeRoot,
  QrCodeFrame,
  QrCodePattern,
  QrCodeOverlay,
  QrCodeDownloadTrigger,
  QrCodeProvider,
  QrCodeContext,
};
