import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

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
const PasswordRequirements = ({ requirements }: PasswordRequirementsProps) => (
  <ul className="mt-1.5 space-y-1" aria-label="Password requirements">
    {requirements.map(({ label, met }) => (
      <li
        key={label}
        className={cn(
          "flex items-center gap-1.5 text-xs transition-colors",
          met ? "text-green-600" : "text-muted-foreground",
        )}
      >
        {met ? (
          <Check className="size-3.5 shrink-0" aria-hidden="true" />
        ) : (
          <X className="size-3.5 shrink-0" aria-hidden="true" />
        )}
        <span>{label}</span>
        <span className="sr-only">{met ? "(met)" : "(not met)"}</span>
      </li>
    ))}
  </ul>
);

export { PasswordRequirements };
