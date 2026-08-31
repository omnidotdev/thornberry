interface EditProfileProps {
    /**
     * Host-supplied uniqueness check for the unified handle namespace. When
     * supplied, the username field shows live availability and submit is blocked
     * for a taken handle. Omit to skip the availability check entirely.
     */
    checkUsernameAvailability?: (username: string) => Promise<{
        available: boolean;
    }>;
    /**
     * Called after a successful update so the host can refresh session/profile
     * data (e.g. router.invalidate() or a session refetch).
     */
    onProfileUpdated?: () => void;
}
/**
 * Edit the current user's profile (name, username, email). Drives the injected
 * client's updateUser/changeEmail; the handle-availability check and the
 * post-update refresh are host-supplied so the block stays app-agnostic.
 */
declare const EditProfile: ({ checkUsernameAvailability, onProfileUpdated, }: EditProfileProps) => import("react/jsx-runtime").JSX.Element;
export { EditProfile };
