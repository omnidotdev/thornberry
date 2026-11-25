import {
  ArrowLeftRight,
  ChevronsUpDown,
  ExternalLink,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/registry/thornberry/components/avatar";
import {
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuItemText,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/thornberry/components/menu";

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
const getInitials = (name?: string | null, email?: string | null): string => {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const first = words[0];

  if (first) {
    const last = words.length > 1 ? words[words.length - 1] : undefined;
    // Array.from splits by code point, so an emoji or astral letter stays whole
    const initials =
      (Array.from(first)[0] ?? "") + (last ? (Array.from(last)[0] ?? "") : "");

    return initials.toUpperCase();
  }

  const fromEmail = Array.from((email ?? "").trim())[0];

  return fromEmail ? fromEmail.toUpperCase() : "?";
};

/**
 * An entry in the account menu. A menu item with a touch-sized target; wrap an
 * app's router link with `asChild` to make it a destination
 */
const AccountMenuItem = ({
  className,
  ...rest
}: ComponentProps<typeof MenuItem>) => (
  <MenuItem
    className={cn("justify-start pointer-coarse:min-h-11", className)}
    {...rest}
  />
);

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

/** An account's avatar: its image, or initials while none loads */
const AccountAvatar = ({
  account,
  size,
}: {
  account: AccountMenuUser;
  size: ComponentProps<typeof AvatarRoot>["size"];
}) => (
  <AvatarRoot size={size}>
    <AvatarImage src={account.image ?? undefined} alt="" />
    <AvatarFallback className="font-medium">
      {getInitials(account.name?.trim() || null, account.email?.trim() || null)}
    </AvatarFallback>
  </AvatarRoot>
);

const sameEmail = (a?: string | null, b?: string | null) =>
  Boolean(a && b && a.trim().toLowerCase() === b.trim().toLowerCase());

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
const AccountMenu = ({
  user,
  onSignOut,
  onSwitchAccount,
  switchAccountLabel = "Switch account",
  accounts,
  onSelectAccount,
  onSignOutAll,
  signOutAllLabel = "Sign out of all accounts",
  children,
  manageAccountUrl,
  manageAccountLabel = "Manage account",
  signOutLabel = "Sign out",
  variant = "avatar",
  triggerLabel = "Open account menu",
  avatarSize,
  className,
  contentClassName,
  positioning,
}: AccountMenuProps) => {
  const name = user.name?.trim() || null;
  const email = user.email?.trim() || null;
  const isSidebar = variant === "sidebar";

  // Every account but the signed-in one; listed only when the app can switch
  const rememberedOthers = (accounts ?? []).filter(
    (account) => !sameEmail(account.email, email),
  );
  const otherAccounts = onSelectAccount ? rememberedOthers : [];

  const avatar = (
    <AccountAvatar
      account={user}
      size={avatarSize ?? (isSidebar ? "xs" : "sm")}
    />
  );

  return (
    <MenuRoot
      positioning={
        positioning ?? { placement: isSidebar ? "right-end" : "bottom-end" }
      }
    >
      {isSidebar ? (
        <MenuTrigger
          className={cn(
            "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm transition-colors hover:bg-muted data-[state=open]:bg-muted pointer-coarse:min-h-11",
            // A collapsed icon sidebar keeps just the avatar
            "group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0",
            className,
          )}
        >
          {avatar}
          {/* Visually hidden, not removed, in a collapsed icon sidebar, so the
              avatar-only row keeps the user's name as its accessible name */}
          <span className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:sr-only">
            <span className="truncate font-medium">{name ?? email}</span>
            {name && email && (
              <span className="text-muted-foreground truncate text-xs">
                {email}
              </span>
            )}
          </span>
          <ChevronsUpDown
            className="text-muted-foreground size-4 shrink-0 group-data-[collapsible=icon]:hidden"
            aria-hidden
          />
        </MenuTrigger>
      ) : (
        <MenuTrigger
          aria-label={triggerLabel}
          className={cn(
            // A 44px target around the avatar on touch screens
            "inline-flex shrink-0 items-center justify-center rounded-full transition-shadow hover:ring-2 hover:ring-border data-[state=open]:ring-2 data-[state=open]:ring-border pointer-coarse:size-11",
            className,
          )}
        >
          {avatar}
        </MenuTrigger>
      )}

      <MenuPositioner>
        <MenuContent className={cn("min-w-56 max-w-xs", contentClassName)}>
          <MenuItemGroup>
            {(name || email) && (
              <MenuItemGroupLabel className="flex-col items-start gap-0.5">
                <span className="w-full truncate">{name ?? email}</span>
                {name && email && (
                  <span className="text-muted-foreground w-full truncate text-xs font-normal">
                    {email}
                  </span>
                )}
              </MenuItemGroupLabel>
            )}

            {children}

            {manageAccountUrl && (
              <AccountMenuItem value="manage-account" asChild>
                <a href={manageAccountUrl} target="_blank" rel="noreferrer">
                  <MenuItemText>{manageAccountLabel}</MenuItemText>
                  <ExternalLink className="ml-auto" aria-hidden />
                </a>
              </AccountMenuItem>
            )}
          </MenuItemGroup>

          <MenuSeparator />

          {otherAccounts.length > 0 && (
            <MenuItemGroup>
              <MenuItemGroupLabel className="sr-only">
                Other accounts
              </MenuItemGroupLabel>
              {otherAccounts.map((account) => {
                const accountName = account.name?.trim() || null;
                const accountEmail = account.email?.trim() || null;

                return (
                  <AccountMenuItem
                    key={account.id}
                    value={`account:${account.id}`}
                    onSelect={() => onSelectAccount?.(account)}
                    className="gap-2"
                  >
                    <AccountAvatar account={account} size="xs" />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate">
                        {accountName ?? accountEmail}
                      </span>
                      {accountName && accountEmail && (
                        <span className="text-muted-foreground truncate text-xs">
                          {accountEmail}
                        </span>
                      )}
                    </span>
                  </AccountMenuItem>
                );
              })}
            </MenuItemGroup>
          )}

          {onSwitchAccount && (
            <AccountMenuItem value="switch-account" onSelect={onSwitchAccount}>
              <ArrowLeftRight aria-hidden />
              <MenuItemText>{switchAccountLabel}</MenuItemText>
            </AccountMenuItem>
          )}

          <AccountMenuItem
            value="sign-out"
            variant="destructive"
            onSelect={onSignOut}
          >
            <LogOut aria-hidden />
            <MenuItemText>{signOutLabel}</MenuItemText>
          </AccountMenuItem>

          {onSignOutAll && rememberedOthers.length > 0 && (
            <AccountMenuItem
              value="sign-out-all"
              variant="destructive"
              onSelect={onSignOutAll}
            >
              <LogOut aria-hidden />
              <MenuItemText>{signOutAllLabel}</MenuItemText>
            </AccountMenuItem>
          )}
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  );
};

export type { AccountMenuAccount, AccountMenuProps, AccountMenuUser };
export { AccountMenu, AccountMenuItem, getInitials };
