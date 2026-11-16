import {
  buttonVariants2
} from "./ai-describe-panel-k2cwy48h.js";
import {
  cn
} from "./ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/qr-code.tsx
import { QrCode as ArkQrCode } from "@ark-ui/react/qr-code";
import { jsx, jsxs } from "react/jsx-runtime";
var QrCodeProvider2 = ArkQrCode.RootProvider;
var QrCodeContext2 = ArkQrCode.Context;
var QrCodeRoot2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkQrCode.Root, {
  className: cn("inline-flex w-fit shrink-0 items-center justify-center rounded-md bg-white p-3", className),
  ...rest
});
var QrCodeFrame2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkQrCode.Frame, {
  role: "img",
  "aria-label": "QR code",
  className: cn("block size-full", className),
  ...rest
});
var QrCodePattern2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkQrCode.Pattern, {
  className: cn("fill-black", className),
  ...rest
});
var QrCodeOverlay2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkQrCode.Overlay, {
  className: cn("flex items-center justify-center rounded-md bg-white p-1", className),
  ...rest
});
var QrCodeDownloadTrigger2 = ({
  className,
  variant = "outline",
  size = "sm",
  ...rest
}) => /* @__PURE__ */ jsx(ArkQrCode.DownloadTrigger, {
  className: cn(buttonVariants2({ variant, size }), className),
  ...rest
});
var QrCode2 = ({
  size = 160,
  errorCorrection,
  overlay,
  label = "QR code",
  ...rest
}) => /* @__PURE__ */ jsxs(QrCodeRoot2, {
  encoding: { ecc: errorCorrection ?? (overlay ? "H" : "L") },
  ...rest,
  children: [
    /* @__PURE__ */ jsx(QrCodeFrame2, {
      "aria-label": label,
      style: { width: size, height: size },
      children: /* @__PURE__ */ jsx(QrCodePattern2, {})
    }),
    overlay && /* @__PURE__ */ jsx(QrCodeOverlay2, {
      children: overlay
    })
  ]
});
export { QrCodeProvider2, QrCodeContext2, QrCodeRoot2, QrCodeFrame2, QrCodePattern2, QrCodeOverlay2, QrCodeDownloadTrigger2, QrCode2 };
