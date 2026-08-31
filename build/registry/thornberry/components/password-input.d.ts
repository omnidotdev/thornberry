import { Input } from "../../../registry/thornberry/components/input";
import type { ComponentProps } from "react";
/**
 * A password input with a show/hide toggle. Standalone (not tied to a form
 * context) so it can be used both inside form fields and on its own (e.g. a 2FA
 * password prompt). The toggle is disabled while the field is empty.
 */
declare const PasswordInput: ({ className, ...props }: ComponentProps<typeof Input>) => import("react/jsx-runtime").JSX.Element;
export { PasswordInput };
