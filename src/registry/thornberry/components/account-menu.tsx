import { ExternalLink, LogOut } from "lucide-react";

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
  /** App destinations (`AccountMenuItem`s), listed under the user's name */
  children?: ReactNode;
  /** Link to the shared Omni account hub, opened in a new tab when set */
  manageAccountUrl?: string;
  manageAccountLabel?: string;
  signOutLabel?: string;
  /** Accessible name of the avatar trigger */
  triggerLabel?: string;
  /** Avatar size in the trigger */
  avatarSize?: ComponentProps<typeof AvatarRoot>["size"];
  /** Classes for the avatar trigger */
  className?: string;
  /** Classes for the menu panel */
  contentClassName?: string;
  /** Menu placement relative to the avatar. Defaults to below, end-aligned */
  positioning?: ComponentProps<typeof MenuRoot>["positioning"];
}

/**
 * The standard Omni account menu: the signed-in user's avatar (initials while
 * no image loads), opening a menu headed by their name and email, with the
 * app's destinations, an optional link to the Omni account hub, and Sign out.
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
  children,
  manageAccountUrl,
  manageAccountLabel = "Manage account",
  signOutLabel = "Sign out",
  triggerLabel = "Open account menu",
  avatarSize = "sm",
  className,
  contentClassName,
  positioning = { placement: "bottom-end" },
}: AccountMenuProps) => {
  const name = user.name?.trim() || null;
  const email = user.email?.trim() || null;

  return (
    <MenuRoot positioning={positioning}>
      <MenuTrigger
        aria-label={triggerLabel}
        className={cn(
          // A 44px target around the avatar on touch screens
          "inline-flex shrink-0 items-center justify-center rounded-full transition-shadow hover:ring-2 hover:ring-border data-[state=open]:ring-2 data-[state=open]:ring-border pointer-coarse:size-11",
          className,
        )}
      >
        <AvatarRoot size={avatarSize}>
          <AvatarImage src={user.image ?? undefined} alt="" />
          <AvatarFallback className="font-medium">
            {getInitials(name, email)}
          </AvatarFallback>
        </AvatarRoot>
      </MenuTrigger>

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

          <AccountMenuItem
            value="sign-out"
            variant="destructive"
            onSelect={onSignOut}
          >
            <LogOut aria-hidden />
            <MenuItemText>{signOutLabel}</MenuItemText>
          </AccountMenuItem>
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  );
};

export type { AccountMenuProps, AccountMenuUser };
export { AccountMenu, AccountMenuItem, getInitials };
