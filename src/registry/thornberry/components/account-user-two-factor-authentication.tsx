import { Loader2, QrCode, ShieldCheck, ShieldOff } from "lucide-react";
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

/**
 * Two-factor authentication self-service: enable (password -> TOTP QR -> verify
 * code), disable (password), and re-scan the QR while enabled. Drives the
 * injected client's twoFactor methods and reports through the toaster.
 */
const UserTwoFactorAuthentication = () => {
  const { authClient, toaster } = useAccountContext();

  const { data: session } = authClient.useSession();

  const [isPendingTwoFa, setIsPendingTwoFa] = useState(false);
  const [password, setPassword] = useState("");
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [twoFactorVerifyUri, setTwoFactorVerifyUri] = useState("");

  const twoFactorEnabled = !!session?.user.twoFactorEnabled;

  return (
    <>
      <h3 className="font-bold text-xl">Two-Factor Authentication</h3>

      {twoFactorEnabled && (
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
                  Scan the QR code with your TOTP app
                </DialogDescription>
              </div>

              {twoFactorVerifyUri ? (
                <>
                  <QRCode value={twoFactorVerifyUri} />

                  <p>Copy URI to clipboard</p>

                  <input
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
                    placeholder="Enter Password"
                  />

                  <Button
                    onClick={async () => {
                      if (password.length < 8) {
                        toaster.error({
                          title: "Password must be at least 8 characters",
                        });
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
                    }}
                  >
                    Show QR Code
                  </Button>
                </>
              )}
            </DialogContent>
          </DialogPositioner>
        </DialogRoot>
      )}

      <DialogRoot
        open={twoFactorDialogOpen}
        onOpenChange={({ open }) => setTwoFactorDialogOpen(open)}
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
                {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
              </DialogTitle>
              <DialogDescription>
                {twoFactorEnabled
                  ? "Disable the second authentication factor from your account."
                  : "Enable 2FA to secure your account."}
              </DialogDescription>
            </div>

            {twoFactorVerifyUri ? (
              <>
                <QRCode value={twoFactorVerifyUri} />

                <Label htmlFor="two-factor-code">
                  Scan the QR code with your TOTP app.
                </Label>

                <Input
                  id="two-factor-code"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter OTP"
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
                />
              </>
            )}

            <Button
              disabled={isPendingTwoFa}
              onClick={async () => {
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
                        setTwoFactorDialogOpen(false);
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
                        setTwoFactorVerifyUri("");
                        setIsPendingTwoFa(false);
                        setPassword("");
                        setTwoFactorDialogOpen(false);
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
                      },
                    },
                  });
                }

                setIsPendingTwoFa(false);
                setPassword("");
              }}
            >
              {isPendingTwoFa ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
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
