import type { ReactNode } from "react";
interface AccountProfileSettingsProps {
    /** Avatar storage, forwarded to the AvatarUpload block */
    avatar?: {
        uploadEnabled?: boolean;
        onUpload?: (blob: Blob) => Promise<void>;
        onClear?: () => Promise<void>;
    };
    /**
     * Host handle-availability check. When omitted the username field is hidden,
     * since a handle cannot be claimed safely without one
     */
    checkUsernameAvailability?: (username: string) => Promise<{
        available: boolean;
    }>;
    /** Identity badges (role/team) rendered beside the name */
    badges?: ReactNode;
    /** Content rendered at the top of the email card (e.g. a confirm-email prompt) */
    emailNotice?: ReactNode;
    /** Where the email-change verification link returns the user */
    changeEmailCallbackURL?: string;
    /** Called after a profile or avatar change (host refreshes its own data) */
    onProfileUpdated?: () => void | Promise<void>;
}
/**
 * Profile settings: avatar, name, username, and email change. Reads the user
 * from the injected client's session and saves through `updateUser` and
 * `changeEmail`; storage-specific pieces (avatar upload, handle check) are host
 * callbacks, so the same page renders in an identity server and in a
 * relying-party account app.
 */
declare const AccountProfileSettings: (props: AccountProfileSettingsProps) => import("react/jsx-runtime").JSX.Element | null;
export type { AccountProfileSettingsProps };
export { AccountProfileSettings };
