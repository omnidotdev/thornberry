import { AvatarRoot } from "../../../registry/thornberry/components/avatar";
import { MenuItem, MenuRoot } from "../../../registry/thornberry/components/menu";
import type { ComponentProps, ReactNode } from "react";
/** The signed-in user the account menu belongs to */
interface AccountMenuUser {
    name?: string | null;
    email?: string | null;
    /** Avatar URL, if set; falls back to initials */
    image?: string | null;
}
/** Another account signed in on this browser, listed for one-click switching */
interface AccountMenuAccount extends AccountMenuUser {
    /** Stable key for the account (e.g. its remembered-account handle) */
    id: string;
}
/**
 * Up to two initials for an avatar fallback: the first letters of the first
 * and last words of the name, else the first letter of the email, else "?"
 * @param name - The user's display name
 * @param email - The user's email, used when the name is blank
 */
declare const getInitials: (name?: string | null, email?: string | null) => string;
/**
 * An entry in the account menu. A menu item with a touch-sized target; wrap an
 * app's router link with `asChild` to make it a destination
 */
declare const AccountMenuItem: ({ className, ...rest }: ComponentProps<typeof MenuItem>) => import("react/jsx-runtime").JSX.Element;
interface AccountMenuProps {
    /** The signed-in user */
    user: AccountMenuUser;
    /** Signs the user out; offered as the last entry */
    onSignOut: () => void;
    /**
     * Switches to another Omni account (the app re-runs sign-in with
     * `prompt=select_account`, which shows the account picker); offered just
     * above Sign out when set
     */
    onSwitchAccount?: () => void;
    switchAccountLabel?: string;
    /**
     * Other accounts signed in on this browser (e.g. from `useRememberedAccounts`
     * in `@omnidotdev/providers/react`), listed above Switch account when
     * `onSelectAccount` is set; the signed-in user's own account is left out by
     * email. Any other account here also splits Sign out (see `onSignOutAll`)
     */
    accounts?: AccountMenuAccount[];
    /**
     * Switches straight to one of `accounts` (the app re-runs sign-in with
     * `prompt=select_account` and the account's handle as `login_hint`)
     */
    onSelectAccount?: (account: AccountMenuAccount) => void;
    /**
     * Signs out of every account on this browser. When set and other accounts
     * are listed, Sign out ends only this account and a "Sign out of all
     * accounts" entry follows it
     */
    onSignOutAll?: () => void;
    signOutAllLabel?: string;
    /** App destinations (`AccountMenuItem`s), listed under the user's name */
    children?: ReactNode;
    /** Link to the shared Omni account hub, opened in a new tab when set */
    manageAccountUrl?: string;
    manageAccountLabel?: string;
    signOutLabel?: string;
    /**
     * Trigger layout: "avatar" is the round avatar for a header; "sidebar" is a
     * full-width row with the avatar, name, and email for a sidebar footer (it
     * shrinks to the avatar in a collapsed icon sidebar). Defaults to "avatar"
     */
    variant?: "avatar" | "sidebar";
    /** Accessible name of the avatar trigger (the sidebar row is named by its text) */
    triggerLabel?: string;
    /** Avatar size in the trigger. Defaults to "sm", or "xs" in the sidebar row */
    avatarSize?: ComponentProps<typeof AvatarRoot>["size"];
    /** Classes for the avatar trigger */
    className?: string;
    /** Classes for the menu panel */
    contentClassName?: string;
    /**
     * Menu placement relative to the trigger. Defaults to below, end-aligned for
     * the avatar, and to the right, bottom-aligned for the sidebar row
     */
    positioning?: ComponentProps<typeof MenuRoot>["positioning"];
}
/**
 * The standard Omni account menu: the signed-in user's avatar (initials while
 * no image loads), opening a menu headed by their name and email, with the
 * app's destinations, an optional link to the Omni account hub, the other
 * accounts signed in on this browser, an optional Switch account, and Sign out
 * (split into this account and all accounts when others are signed in).
 *
 * Presentational and router-agnostic: the host app passes the user, its own
 * destinations as children, and the sign-out handler. Every entry is a menu
 * item, so the arrow keys, Home/End, typeahead, and Escape all work.
 *
 * @example
 * <AccountMenu user={auth.user} onSignOut={signOut} manageAccountUrl={hubUrl}>
 *   <AccountMenuItem value="/profile" asChild>
 *     <Link to="/profile">Profile</Link>
 *   </AccountMenuItem>
 * </AccountMenu>
 */
declare const AccountMenu: ({ user, onSignOut, onSwitchAccount, switchAccountLabel, accounts, onSelectAccount, onSignOutAll, signOutAllLabel, children, manageAccountUrl, manageAccountLabel, signOutLabel, variant, triggerLabel, avatarSize, className, contentClassName, positioning, }: AccountMenuProps) => import("react/jsx-runtime").JSX.Element;
export type { AccountMenuAccount, AccountMenuProps, AccountMenuUser };
export { AccountMenu, AccountMenuItem, getInitials };
