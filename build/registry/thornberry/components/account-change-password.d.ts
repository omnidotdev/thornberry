import type { PasswordRequirement } from "../../../registry/thornberry/components/account-password-requirements";
interface ChangePasswordProps {
    /**
     * Host-owned password policy: given a candidate password, returns the rule
     * checklist. When supplied, the checklist renders live and every rule must be
     * met to submit. Omit it to enforce only "different from current" and "matches
     * confirmation" (the server remains the source of truth either way).
     */
    passwordRequirements?: (password: string) => PasswordRequirement[];
}
/**
 * Change the current user's password. Drives the injected client's
 * changePassword and reports through the toaster; the password policy is
 * host-supplied so the block stays policy-agnostic.
 */
declare const ChangePassword: ({ passwordRequirements }: ChangePasswordProps) => import("react/jsx-runtime").JSX.Element;
export { ChangePassword };
