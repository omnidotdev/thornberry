/**
 * Organization management for the account console: lists the organizations the
 * user belongs to, creates new ones, and drills into each for member, role, and
 * invitation management plus delete/leave. Reads and mutates entirely through
 * the injected auth client, so the same block renders in an identity server's
 * dashboard and in a relying-party account app. Fill `AccountConsole`'s
 * `organizationsSection` slot with it, or render it standalone.
 */
declare const AccountOrganizations: ({ selectedSlug: controlledSlug, onSelectOrganization, }?: {
    /**
     * The org slug currently drilled into. Provide together with
     * `onSelectOrganization` to make list/detail navigation controlled, so a host
     * can reflect it in the URL; omit both for internal (uncontrolled) state.
     */
    selectedSlug?: string | null;
    onSelectOrganization?: (slug: string | null) => void;
}) => import("react/jsx-runtime").JSX.Element;
export { AccountOrganizations };
