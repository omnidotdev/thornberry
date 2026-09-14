import type { AccountOrgMember } from "../../../registry/thornberry/components/account-provider";
/**
 * Team management within an organization: list the org's teams, create and
 * rename them, delete them, and manage each team's membership by adding or
 * removing organization members. Driven through the injected client + toaster,
 * so it renders in an identity server's dashboard and a relying-party account
 * app alike. Intended to sit inside an organization's management view; pass the
 * organization id and its members (the pool teams draw from).
 */
declare const AccountOrganizationTeams: ({ organizationId, members, currentUserId, }: {
    organizationId: string;
    members: AccountOrgMember[];
    /** Gatekeeper user id of the viewer, used to suffix "(you)" on their row. */
    currentUserId?: string;
}) => import("react/jsx-runtime").JSX.Element;
export { AccountOrganizationTeams };
