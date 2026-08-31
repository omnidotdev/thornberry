/** A single password-policy rule and whether the candidate password meets it */
export interface PasswordRequirement {
    label: string;
    met: boolean;
}
interface PasswordRequirementsProps {
    /**
     * The evaluated rules to display. The host owns the password policy (min
     * length, character classes, etc.) and passes the already-evaluated list, so
     * this block stays policy-agnostic.
     */
    requirements: PasswordRequirement[];
}
/**
 * Live password-requirements checklist. Each rule turns green the moment it is
 * satisfied, so a user sees exactly what is expected before submitting.
 */
declare const PasswordRequirements: ({ requirements }: PasswordRequirementsProps) => import("react/jsx-runtime").JSX.Element;
export { PasswordRequirements };
