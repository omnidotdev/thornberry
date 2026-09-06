/**
 * Organization management for the account console: lists the organizations the
 * user belongs to, creates new ones, and drills into each for member, role, and
 * invitation management plus delete/leave. Reads and mutates entirely through
 * the injected auth client, so the same block renders in an identity server's
 * dashboard and in a relying-party account app. Fill `AccountConsole`'s
 * `organizationsSection` slot with it, or render it standalone.
 */
declare const AccountOrganizations: () => import("react/jsx-runtime").JSX.Element;
export { AccountOrganizations };
