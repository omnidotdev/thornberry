import { QrCode as ArkQrCode } from "@ark-ui/react/qr-code";
import { buttonVariants } from "../../../registry/thornberry/components/button";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
/**
 * Error correction level: how much of the code can be damaged or covered and
 * still scan (L 7%, M 15%, Q 25%, H 30%). Higher levels make denser codes.
 */
type QrCodeErrorCorrection = "L" | "M" | "Q" | "H";
declare const QrCodeProvider: import("react").ForwardRefExoticComponent<ArkQrCode.RootProviderProps & import("react").RefAttributes<HTMLDivElement>>;
declare const QrCodeContext: (props: ArkQrCode.ContextProps) => ReactNode;
/**
 * Scanners expect dark modules on a light background, so the code always
 * renders black on white with a padded quiet zone and never follows a dark
 * theme.
 */
declare const QrCodeRoot: ({ className, ...rest }: ComponentProps<typeof ArkQrCode.Root>) => import("react/jsx-runtime").JSX.Element;
/** The `<svg>` that draws the code. Sized by `width`/`height` or CSS. */
declare const QrCodeFrame: ({ className, ...rest }: ComponentProps<typeof ArkQrCode.Frame>) => import("react/jsx-runtime").JSX.Element;
declare const QrCodePattern: ({ className, ...rest }: ComponentProps<typeof ArkQrCode.Pattern>) => import("react/jsx-runtime").JSX.Element;
/**
 * Content centered over the code, such as a logo. Keep it under about a fifth
 * of the code's width and use a high error correction level so it still scans.
 */
declare const QrCodeOverlay: ({ className, ...rest }: ComponentProps<typeof ArkQrCode.Overlay>) => import("react/jsx-runtime").JSX.Element;
/** Downloads the code as an image (`fileName` and `mimeType` are required). */
declare const QrCodeDownloadTrigger: ({ className, variant, size, ...rest }: ComponentProps<typeof ArkQrCode.DownloadTrigger> & VariantProps<typeof buttonVariants>) => import("react/jsx-runtime").JSX.Element;
interface QrCodeProps extends Omit<ComponentProps<typeof ArkQrCode.Root>, "encoding"> {
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
declare const QrCode: ({ size, errorCorrection, overlay, label, ...rest }: QrCodeProps) => import("react/jsx-runtime").JSX.Element;
export type { QrCodeErrorCorrection };
export { QrCode, QrCodeContext, QrCodeDownloadTrigger, QrCodeFrame, QrCodeOverlay, QrCodePattern, QrCodeProvider, QrCodeRoot, };
