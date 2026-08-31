import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";

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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface EditProfileProps {
  /**
   * Host-supplied uniqueness check for the unified handle namespace. When
   * supplied, the username field shows live availability and submit is blocked
   * for a taken handle. Omit to skip the availability check entirely.
   */
  checkUsernameAvailability?: (
    username: string,
  ) => Promise<{ available: boolean }>;
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
const EditProfile = ({
  checkUsernameAvailability,
  onProfileUpdated,
}: EditProfileProps) => {
  const { authClient, toaster, brand } = useAccountContext();

  const { data } = authClient.useSession();
  const user = data?.user;

  const [open, setOpen] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null,
  );

  const form = useAppForm({
    defaultValues: {
      firstName: user?.name.split(" ")[0] ?? "",
      lastName: user?.name.split(" ")[1] ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
    },
    onSubmit: ({ value }) =>
      toaster.promise(
        async () => {
          if (checkUsernameAvailability && value.username !== user?.username) {
            const { available } = await checkUsernameAvailability(
              value.username,
            );

            if (!available) {
              throw new Error(
                `Username "${value.username}" is not available. Please choose a different one.`,
              );
            }
          }

          const res = await authClient.updateUser({
            name: `${value.firstName} ${value.lastName}`,
            username: value.username,
          });

          if (res.error) {
            throw new Error(res.error.message || "Error updating profile");
          }

          if (value.email !== user?.email) {
            const emailRes = await authClient.changeEmail({
              newEmail: value.email,
              callbackURL: "/dashboard?status=email_confirmed",
            });

            if (emailRes.error) {
              throw new Error(emailRes.error.message || "Error changing email");
            }
          }

          setOpen(false);
          onProfileUpdated?.();
          form.reset();
        },
        {
          loading: { title: "Submitting edit profile request..." },
          success: {
            duration: 3000,
            title:
              value.email !== user?.email
                ? "Change Email Verification Sent"
                : "Profile updated successfully",
            description:
              value.email !== user?.email
                ? "Please follow the instructions in your email to verify your new email address."
                : undefined,
          },
          error: (error) => ({
            title: (error as Error).message || "Error updating profile",
          }),
        },
      ),
  });

  return (
    <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-1 size-3" />
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogBackdrop />

      <DialogPositioner>
        <DialogContent>
          <div className="flex flex-col gap-1.5">
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="size-4" />
              Edit Profile
            </DialogTitle>
            <DialogDescription>
              Edit your {brand.organizationName} profile information.
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
              name="firstName"
              validators={{
                onSubmit: ({ value }) =>
                  value ? undefined : "First name is required",
              }}
            >
              {(field) => (
                <field.TextField label="First Name" placeholder="John" />
              )}
            </form.AppField>

            <form.AppField
              name="lastName"
              validators={{
                onSubmit: ({ value }) =>
                  value ? undefined : "Last name is required",
              }}
            >
              {(field) => (
                <field.TextField label="Last Name" placeholder="Doe" />
              )}
            </form.AppField>

            <form.AppField
              name="username"
              validators={{
                onSubmit: ({ value }) =>
                  value.length >= 3
                    ? undefined
                    : "Username must be at least 3 characters",
              }}
              listeners={{
                onChangeDebounceMs: 500,
                onChange: async ({ value }) => {
                  if (
                    !checkUsernameAvailability ||
                    value === user?.username ||
                    value.length < 3
                  ) {
                    setUsernameAvailable(null);
                    return;
                  }

                  const { available } = await checkUsernameAvailability(value);
                  setUsernameAvailable(available);
                },
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-1">
                  <field.TextField label="Username" placeholder="johndoe" />
                  {usernameAvailable !== null && (
                    <div className="flex items-center gap-1">
                      {usernameAvailable ? (
                        <>
                          <Check className="size-3 text-green-600" />
                          <p className="text-green-600 text-xs">Available</p>
                        </>
                      ) : (
                        <>
                          <X className="size-3 text-red-500" />
                          <p className="text-red-500 text-xs">Already taken</p>
                        </>
                      )}
                    </div>
                  )}
                  <p className="text-muted-foreground text-xs">
                    Changing your username will also update your personal
                    organization handle.
                  </p>
                </div>
              )}
            </form.AppField>

            <form.AppField
              name="email"
              validators={{
                onSubmit: ({ value }) =>
                  EMAIL_PATTERN.test(value)
                    ? undefined
                    : "Enter a valid email address",
              }}
            >
              {(field) => (
                <field.TextField
                  label="Email"
                  placeholder={brand.placeholderEmail ?? "you@example.com"}
                />
              )}
            </form.AppField>

            <form.AppForm>
              <form.SubmitButton label="Update Profile" />
            </form.AppForm>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export { EditProfile };
