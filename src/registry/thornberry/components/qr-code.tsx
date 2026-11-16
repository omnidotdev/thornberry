import { QrCode as ArkQrCode } from "@ark-ui/react/qr-code";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/registry/thornberry/components/button";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

/**
 * Error correction level: how much of the code can be damaged or covered and
 * still scan (L 7%, M 15%, Q 25%, H 30%). Higher levels make denser codes.
 */
type QrCodeErrorCorrection = "L" | "M" | "Q" | "H";

const QrCodeProvider = ArkQrCode.RootProvider;
const QrCodeContext = ArkQrCode.Context;

/**
 * Scanners expect dark modules on a light background, so the code always
 * renders black on white with a padded quiet zone and never follows a dark
 * theme.
 */
const QrCodeRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkQrCode.Root>) => (
  <ArkQrCode.Root
    className={cn(
      "inline-flex w-fit shrink-0 items-center justify-center rounded-md bg-white p-3",
      className,
    )}
    {...rest}
  />
);

/** The `<svg>` that draws the code. Sized by `width`/`height` or CSS. */
const QrCodeFrame = ({
  className,
  ...rest
}: ComponentProps<typeof ArkQrCode.Frame>) => (
  <ArkQrCode.Frame
    role="img"
    aria-label="QR code"
    className={cn("block size-full", className)}
    {...rest}
  />
);

const QrCodePattern = ({
  className,
  ...rest
}: ComponentProps<typeof ArkQrCode.Pattern>) => (
  <ArkQrCode.Pattern className={cn("fill-black", className)} {...rest} />
);

/**
 * Content centered over the code, such as a logo. Keep it under about a fifth
 * of the code's width and use a high error correction level so it still scans.
 */
const QrCodeOverlay = ({
  className,
  ...rest
}: ComponentProps<typeof ArkQrCode.Overlay>) => (
  <ArkQrCode.Overlay
    className={cn(
      "flex items-center justify-center rounded-md bg-white p-1",
      className,
    )}
    {...rest}
  />
);

/** Downloads the code as an image (`fileName` and `mimeType` are required). */
const QrCodeDownloadTrigger = ({
  className,
  variant = "outline",
  size = "sm",
  ...rest
}: ComponentProps<typeof ArkQrCode.DownloadTrigger> &
  VariantProps<typeof buttonVariants>) => (
  <ArkQrCode.DownloadTrigger
    className={cn(buttonVariants({ variant, size }), className)}
    {...rest}
  />
);

interface QrCodeProps
  extends Omit<ComponentProps<typeof ArkQrCode.Root>, "encoding"> {
  /** Rendered width and height of the code, in pixels. */
  size?: number;
  /**
   * Error correction level. Defaults to `"L"`, or `"H"` when an `overlay` is
   * given so the covered modules can be recovered.
   */
  errorCorrection?: QrCodeErrorCorrection;
  /** Content centered over the code, such as a logo. */
  overlay?: ReactNode;
  /** Accessible name of the code image. */
  label?: string;
}

/**
 * Renders `value` (a URL, an `otpauth://` URI, any text) as a scannable QR
 * code.
 *
 * @example
 * <QrCode value="https://omni.dev" />
 * <QrCode value={url} size={160} overlay={<img src={logo} alt="" className="size-8" />} />
 */
const QrCode = ({
  size = 160,
  errorCorrection,
  overlay,
  label = "QR code",
  ...rest
}: QrCodeProps) => (
  <QrCodeRoot
    encoding={{ ecc: errorCorrection ?? (overlay ? "H" : "L") }}
    {...rest}
  >
    <QrCodeFrame aria-label={label} style={{ width: size, height: size }}>
      <QrCodePattern />
    </QrCodeFrame>

    {overlay && <QrCodeOverlay>{overlay}</QrCodeOverlay>}
  </QrCodeRoot>
);

export type { QrCodeErrorCorrection };
export {
  QrCode,
  QrCodeContext,
  QrCodeDownloadTrigger,
  QrCodeFrame,
  QrCodeOverlay,
  QrCodePattern,
  QrCodeProvider,
  QrCodeRoot,
};
