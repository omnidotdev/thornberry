/**
 * Two-factor authentication self-service: enable (password -> TOTP QR -> verify
 * code), disable (password), and re-scan the QR while enabled. Drives the
 * injected client's twoFactor methods and reports through the toaster.
 */
declare const UserTwoFactorAuthentication: () => import("react/jsx-runtime").JSX.Element;
export { UserTwoFactorAuthentication };
