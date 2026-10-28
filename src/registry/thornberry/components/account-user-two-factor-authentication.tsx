import {
  Copy,
  Download,
  ExternalLink,
  KeyRound,
  Loader2,
  QrCode,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";

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
import { Input } from "@/registry/thornberry/components/input";
import { Label } from "@/registry/thornberry/components/label";
import { PasswordInput } from "@/registry/thornberry/components/password-input";

import type { KeyboardEvent } from "react";
import type { AccountContextValue } from "@/registry/thornberry/components/account-provider";

/**
 * Two-factor authentication self-service: enable (password -> TOTP QR -> verify
 * code -> save backup codes), disable (password), re-scan the QR while enabled,
 * and regenerate backup codes. Drives the injected client's twoFactor methods
 * and reports through the toaster.
 */
/** Submit the step's primary action when the user presses Enter in a field. */
const onEnter =
  (run: () => void) =>
  (event: KeyboardEvent): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      run();
    }
  };

/**
 * QR code on a fixed light background with a quiet zone, centered. TOTP QR
 * codes must stay dark-on-light to scan, so this never inherits a dark theme.
 */
const QrPanel = ({ value }: { value: string }) => (
  <div className="flex justify-center">
    <div className="rounded-lg border border-border bg-white p-4">
      <QRCode value={value} size={180} />
    </div>
  </div>
);

/**
 * One-time recovery codes. These are the only way back in if the authenticator
 * is lost, so they are shown prominently with copy and download actions and the
 * explicit warning that they will not be shown again.
 */
const BackupCodesPanel = ({
  codes,
  organizationName,
  toaster,
}: {
  codes: string[];
  organizationName: string;
  toaster: AccountContextValue["toaster"];
}) => (
  <div className="flex flex-col gap-2">
    <p className="font-medium text-sm">
      Save these backup codes somewhere safe. Each one works once to sign in if
      you lose your authenticator. They will not be shown again.
    </p>
    <ul className="grid grid-cols-2 gap-2 rounded-md border border-border bg-muted p-3">
      {codes.map((code) => (
        <li key={code} className="font-mono text-sm">
          {code}
        </li>
      ))}
    </ul>
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        className="w-fit"
        onClick={async () => {
          try {
            await navigator.clipboard?.writeText(codes.join("\n"));
            toaster.success({ title: "Backup codes copied" });
          } catch {
            toaster.error({ title: "Could not copy. Copy them manually." });
          }
        }}
      >
        <Copy className="mr-2 size-4" />
        Copy codes
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="w-fit"
        onClick={() => {
          try {
            const blob = new Blob([`${codes.join("\n")}\n`], {
              type: "text/plain",
            });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `${organizationName.toLowerCase()}-backup-codes.txt`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            URL.revokeObjectURL(url);
          } catch {
            toaster.error({ title: "Could not download. Copy them manually." });
          }
        }}
      >
        <Download className="mr-2 size-4" />
        Download
      </Button>
    </div>
  </div>
);

const UserTwoFactorAuthentication = () => {
  const { authClient, toaster, brand } = useAccountContext();

  const { data: session } = authClient.useSession();

  const [isPendingTwoFa, setIsPendingTwoFa] = useState(false);
  const [password, setPassword] = useState("");
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [twoFactorVerifyUri, setTwoFactorVerifyUri] = useState("");
  // Captured from `enable` (better-auth returns the codes there), held until the
  // user verifies, then surfaced so they are never silently discarded.
  const [pendingBackupCodes, setPendingBackupCodes] = useState<string[]>([]);
  const [enrolledBackupCodes, setEnrolledBackupCodes] = useState<
    string[] | null
  >(null);
  const [codesAcknowledged, setCodesAcknowledged] = useState(false);

  // Regenerate-backup-codes dialog (only while enabled)
  const [regenDialogOpen, setRegenDialogOpen] = useState(false);
  const [regenPassword, setRegenPassword] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratedCodes, setRegeneratedCodes] = useState<string[] | null>(
    null,
  );
  const [regenAcknowledged, setRegenAcknowledged] = useState(false);

  const twoFactorEnabled = !!session?.user.twoFactorEnabled;

  const resetTwoFactorDialog = () => {
    setTwoFactorDialogOpen(false);
    setTwoFactorVerifyUri("");
    setPendingBackupCodes([]);
    setEnrolledBackupCodes(null);
    setCodesAcknowledged(false);
    setPassword("");
  };

  const resetRegenDialog = () => {
    setRegenDialogOpen(false);
    setRegenPassword("");
    setRegeneratedCodes(null);
    setRegenAcknowledged(false);
    setIsRegenerating(false);
  };

  // Primary action of the enable/verify/disable/save-codes dialog, shared by the
  // button and the Enter key.
  const submitTwoFactor = async () => {
    if (enrolledBackupCodes) {
      // "Done": only reachable once the codes are acknowledged
      resetTwoFactorDialog();
      return;
    }

    setIsPendingTwoFa(true);

    if (twoFactorEnabled) {
      await authClient.twoFactor.disable({
        password,
        fetchOptions: {
          onError(context) {
            toaster.error({ title: context.error.message });
          },
          onSuccess() {
            toaster.success({ title: "2FA disabled successfully" });
            resetTwoFactorDialog();
          },
        },
      });
    } else if (twoFactorVerifyUri) {
      await authClient.twoFactor.verifyTotp({
        code: password,
        fetchOptions: {
          onError(context) {
            setIsPendingTwoFa(false);
            setPassword("");
            toaster.error({ title: context.error.message });
          },
          onSuccess() {
            toaster.success({ title: "2FA enabled successfully" });
            // surface the codes captured at `enable` as the final step rather
            // than closing on activation
            setEnrolledBackupCodes(pendingBackupCodes);
            setCodesAcknowledged(false);
            setPendingBackupCodes([]);
            setTwoFactorVerifyUri("");
            setIsPendingTwoFa(false);
            setPassword("");
          },
        },
      });
      return;
    } else {
      await authClient.twoFactor.enable({
        password,
        fetchOptions: {
          onError(context) {
            toaster.error({ title: context.error.message });
          },
          onSuccess(context) {
            setTwoFactorVerifyUri(context.data.totpURI);
            setPendingBackupCodes(context.data.backupCodes ?? []);
          },
        },
      });
    }

    setIsPendingTwoFa(false);
    setPassword("");
  };

  const showRescanQr = async () => {
    if (password.length < 8) {
      toaster.error({ title: "Password must be at least 8 characters" });
      return;
    }
    await authClient.twoFactor.getTotpUri(
      { password },
      {
        onSuccess(context) {
          setTwoFactorVerifyUri(context.data.totpURI);
        },
      },
    );
    setPassword("");
  };

  const submitRegen = async () => {
    if (regenPassword.length < 8) {
      toaster.error({ title: "Password must be at least 8 characters" });
      return;
    }
    setIsRegenerating(true);
    await authClient.twoFactor.generateBackupCodes({
      password: regenPassword,
      fetchOptions: {
        onError(context) {
          toaster.error({ title: context.error.message });
        },
        onSuccess(context) {
          setRegeneratedCodes(context.data.backupCodes ?? []);
        },
      },
    });
    setRegenPassword("");
    setIsRegenerating(false);
  };

  // While unsaved recovery codes are on screen, the dialog must not be
  // dismissed by an outside click or Escape, or the only codes are lost.
  const lockTwoFactorDialog = !!enrolledBackupCodes && !codesAcknowledged;
  const lockRegenDialog = !!regeneratedCodes && !regenAcknowledged;

  return (
    <>
      <h3 className="font-bold text-xl">Two-Factor Authentication</h3>

      <p className="max-w-prose text-muted-foreground text-sm">
        Two-factor authentication adds a second step when you sign in: after
        your password, you enter a short code from an authenticator app on your
        phone. Even if someone learns your password, they can't sign in without
        your phone.
        {brand.securityDocsUrl ? (
          <>
            {" "}
            <a
              href={brand.securityDocsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary underline underline-offset-2"
            >
              Learn more
              <ExternalLink className="size-3" />
            </a>
          </>
        ) : null}
      </p>

      {twoFactorEnabled && (
        <div className="flex flex-wrap gap-2">
          <DialogRoot>
            <DialogTrigger asChild>
              <Button className="w-fit" size="sm" variant="outline">
                <QrCode className="mr-2 size-4" />
                <span>Scan QR Code</span>
              </Button>
            </DialogTrigger>

            <DialogBackdrop />

            <DialogPositioner>
              <DialogContent>
                <div className="flex flex-col gap-1.5">
                  <DialogTitle>Scan QR Code</DialogTitle>
                  <DialogDescription>
                    Add {brand.organizationName} to your authenticator app
                    again. Confirm your password, then scan the code below.
                  </DialogDescription>
                </div>

                {twoFactorVerifyUri ? (
                  <>
                    <QrPanel value={twoFactorVerifyUri} />

                    <Label htmlFor="two-factor-uri">
                      Can't scan? Enter this setup key manually instead.
                    </Label>

                    <input
                      id="two-factor-uri"
                      readOnly
                      value={twoFactorVerifyUri}
                      className="w-full rounded border border-border bg-muted px-2 py-1 font-mono text-sm"
                    />
                  </>
                ) : (
                  <>
                    <PasswordInput
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      onKeyDown={onEnter(showRescanQr)}
                      placeholder="Enter Password"
                    />

                    <Button onClick={showRescanQr}>Show QR Code</Button>
                  </>
                )}
              </DialogContent>
            </DialogPositioner>
          </DialogRoot>

          <DialogRoot
            open={regenDialogOpen}
            closeOnInteractOutside={!lockRegenDialog}
            closeOnEscape={!lockRegenDialog}
            onOpenChange={({ open }) =>
              open ? setRegenDialogOpen(true) : resetRegenDialog()
            }
          >
            <DialogTrigger asChild>
              <Button className="w-fit" size="sm" variant="outline">
                <KeyRound className="mr-2 size-4" />
                <span>Backup codes</span>
              </Button>
            </DialogTrigger>

            <DialogBackdrop />

            <DialogPositioner>
              <DialogContent>
                <div className="flex flex-col gap-1.5">
                  <DialogTitle>Regenerate backup codes</DialogTitle>
                  <DialogDescription>
                    {regeneratedCodes
                      ? "Your previous backup codes no longer work. Save the new ones below."
                      : "Confirm your password to generate a fresh set of backup codes. This invalidates any codes you saved before."}
                  </DialogDescription>
                </div>

                {regeneratedCodes ? (
                  <>
                    <BackupCodesPanel
                      codes={regeneratedCodes}
                      organizationName={brand.organizationName}
                      toaster={toaster}
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={regenAcknowledged}
                        onChange={(event) =>
                          setRegenAcknowledged(event.target.checked)
                        }
                      />
                      I have saved my backup codes
                    </label>
                    <Button
                      className="w-fit"
                      disabled={!regenAcknowledged}
                      onClick={resetRegenDialog}
                    >
                      Done
                    </Button>
                  </>
                ) : (
                  <>
                    <Label htmlFor="regen-password">Password</Label>
                    <PasswordInput
                      id="regen-password"
                      placeholder="Password"
                      value={regenPassword}
                      onChange={(event) => setRegenPassword(event.target.value)}
                      onKeyDown={onEnter(submitRegen)}
                    />
                    <Button disabled={isRegenerating} onClick={submitRegen}>
                      {isRegenerating ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        "Regenerate backup codes"
                      )}
                    </Button>
                  </>
                )}
              </DialogContent>
            </DialogPositioner>
          </DialogRoot>
        </div>
      )}

      <DialogRoot
        open={twoFactorDialogOpen}
        closeOnInteractOutside={!lockTwoFactorDialog}
        closeOnEscape={!lockTwoFactorDialog}
        onOpenChange={({ open }) =>
          open ? setTwoFactorDialogOpen(true) : resetTwoFactorDialog()
        }
      >
        <DialogTrigger asChild>
          <Button
            size="sm"
            className={
              twoFactorEnabled
                ? "w-fit bg-red-600 text-white hover:bg-red-700"
                : "w-fit"
            }
          >
            {twoFactorEnabled ? (
              <ShieldOff className="mr-2 size-4" />
            ) : (
              <ShieldCheck className="mr-2 size-4" />
            )}
            <span>{twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}</span>
          </Button>
        </DialogTrigger>

        <DialogBackdrop />

        <DialogPositioner>
          <DialogContent>
            <div className="flex flex-col gap-1.5">
              <DialogTitle>
                {enrolledBackupCodes
                  ? "Save your backup codes"
                  : twoFactorEnabled
                    ? "Disable 2FA"
                    : "Enable 2FA"}
              </DialogTitle>
              <DialogDescription>
                {enrolledBackupCodes
                  ? "Two-factor authentication is on. Store these recovery codes before you close this."
                  : twoFactorEnabled
                    ? "Turn off two-factor authentication. Your account will be protected by your password alone."
                    : twoFactorVerifyUri
                      ? "Scan the code with your authenticator app, then enter the 6-digit code it shows to finish."
                      : "Confirm your password to begin setting up two-factor authentication."}
              </DialogDescription>
            </div>

            {enrolledBackupCodes ? (
              <>
                <BackupCodesPanel
                  codes={enrolledBackupCodes}
                  organizationName={brand.organizationName}
                  toaster={toaster}
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={codesAcknowledged}
                    onChange={(event) =>
                      setCodesAcknowledged(event.target.checked)
                    }
                  />
                  I have saved my backup codes
                </label>
              </>
            ) : twoFactorVerifyUri ? (
              <>
                <QrPanel value={twoFactorVerifyUri} />

                <Label htmlFor="two-factor-code">
                  Enter the 6-digit code from your authenticator app
                </Label>

                <Input
                  id="two-factor-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={onEnter(submitTwoFactor)}
                  placeholder="000000"
                />
              </>
            ) : (
              <>
                <Label htmlFor="two-factor-password">Password</Label>

                <PasswordInput
                  id="two-factor-password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={onEnter(submitTwoFactor)}
                />
              </>
            )}

            <Button
              disabled={
                isPendingTwoFa || (!!enrolledBackupCodes && !codesAcknowledged)
              }
              onClick={submitTwoFactor}
            >
              {isPendingTwoFa ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : enrolledBackupCodes ? (
                "Done"
              ) : twoFactorEnabled ? (
                "Disable 2FA"
              ) : twoFactorVerifyUri ? (
                "Verify & activate"
              ) : (
                "Enable 2FA"
              )}
            </Button>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </>
  );
};

export { UserTwoFactorAuthentication };
