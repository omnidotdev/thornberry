import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/thornberry/components/button";
import { Input } from "@/registry/thornberry/components/input";

import type { ComponentProps } from "react";

/**
 * A password input with a show/hide toggle. Standalone (not tied to a form
 * context) so it can be used both inside form fields and on its own (e.g. a 2FA
 * password prompt). The toggle is disabled while the field is empty.
 */
const PasswordInput = ({
  className,
  ...props
}: ComponentProps<typeof Input>) => {
  const [showPassword, setShowPassword] = useState(false);

  const disabled =
    props.value === "" || props.value === undefined || props.disabled;

  return (
    <div className="relative">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        className={cn("pr-9", className)}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-0 right-0 size-9 text-muted-foreground hover:text-foreground"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword && !disabled ? (
          <Eye className="size-4" aria-hidden="true" />
        ) : (
          <EyeOff className="size-4" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
};

export { PasswordInput };
