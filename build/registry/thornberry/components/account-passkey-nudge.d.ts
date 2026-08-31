/**
 * Post-login nudge prompting users without a passkey to enroll one for faster,
 * phishing-resistant sign-in. Dismissal persists per-browser in localStorage,
 * read after mount to stay SSR-safe.
 */
declare const PasskeyNudge: () => import("react/jsx-runtime").JSX.Element | null;
export { PasskeyNudge };
