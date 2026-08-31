import { Lock } from "lucide-react";
import { useState } from "react";

import { PasswordRequirements } from "@/registry/thornberry/components/account-password-requirements";
import { useAccountContext } from "@/registry/thornberry/components/account-provider";
import { Button } from "@/registry/thornberry/components/button";
import {
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/registry/thornberry/components/dialog";
import { useAppForm } from "@/registry/thornberry/components/form";

import type { PasswordRequirement } from "@/registry/thornberry/components/account-password-requirements";

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
const ChangePassword = ({ passwordRequirements }: ChangePasswordProps) => {
  const { authClient, toaster, brand } = useAccountContext();

  const [open, setOpen] = useState(false);

  const form = useAppForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: ({ value }) =>
      toaster.promise(
        async () => {
          const res = await authClient.changePassword({
            newPassword: value.newPassword,
            currentPassword: value.currentPassword,
          });

          if (res.error) {
            throw new Error(res.error.message || "Error changing password");
          }

          setOpen(false);
          form.reset();
        },
        {
          loading: { title: "Submitting password change request..." },
          success: { title: "Password changed successfully" },
          error: (error) => ({
            title: (error as Error).message || "Error changing password",
          }),
        },
      ),
  });

  return (
    <DialogRoot
      open={open}
      onOpenChange={({ open }) => {
        setOpen(open);
        if (!open) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Lock className="mr-1 size-3" />
          Change Password
        </Button>
      </DialogTrigger>

      <DialogBackdrop />

      <DialogPositioner>
        <DialogContent>
          <div className="flex flex-col gap-1.5">
            <DialogTitle className="flex items-center gap-2">
              <Lock className="size-4" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Change your {brand.organizationName} account password.
            </DialogDescription>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.AppField
              name="currentPassword"
              validators={{
                onSubmit: ({ value }) =>
                  value ? undefined : "Current password is required",
              }}
            >
              {(field) => (
                <field.PasswordField
                  label="Current Password"
                  placeholder="Password"
                />
              )}
            </form.AppField>

            <form.AppField
              name="newPassword"
              validators={{
                onSubmit: ({ value, fieldApi }) => {
                  if (passwordRequirements?.(value).some((rule) => !rule.met)) {
                    return "Password does not meet the requirements";
                  }

                  if (
                    value === fieldApi.form.getFieldValue("currentPassword")
                  ) {
                    return "Cannot be the same as the old password.";
                  }

                  return undefined;
                },
              }}
            >
              {(field) => (
                <field.PasswordField
                  label="New Password"
                  placeholder="Password"
                />
              )}
            </form.AppField>

            {passwordRequirements && (
              <form.Subscribe selector={(state) => state.values.newPassword}>
                {(newPassword) => (
                  <PasswordRequirements
                    requirements={passwordRequirements(newPassword ?? "")}
                  />
                )}
              </form.Subscribe>
            )}

            <form.AppField
              name="confirmPassword"
              validators={{
                onSubmit: ({ value, fieldApi }) =>
                  value !== fieldApi.form.getFieldValue("newPassword")
                    ? "Passwords do not match."
                    : undefined,
              }}
            >
              {(field) => (
                <field.PasswordField
                  label="Confirm Password"
                  placeholder="Password"
                />
              )}
            </form.AppField>

            <form.AppForm>
              <form.SubmitButton label="Change Password" />
            </form.AppForm>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export { ChangePassword };
