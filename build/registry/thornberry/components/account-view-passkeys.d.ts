/**
 * List the user's registered passkeys with the option to remove each, and enroll
 * a first passkey inline when none exist. Reads and mutates through the injected
 * auth client and reports results through the toaster.
 */
declare const ViewPasskeys: () => import("react/jsx-runtime").JSX.Element;
export { ViewPasskeys };
