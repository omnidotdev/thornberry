import { afterEach, describe, expect, test } from "bun:test";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";

import { AccountProvider } from "@/registry/thornberry/components/account-provider";
import { UserTwoFactorAuthentication } from "@/registry/thornberry/components/account-user-two-factor-authentication";

import type { AccountContextValue } from "@/registry/thornberry/components/account-provider";

// A minimal client where `enable` starts setup and returns the TOTP URI to
// scan (better-auth does not activate 2FA until verify-totp), so the block
// should move on to the verification step rather than claim it is done.
const makeClient = () =>
  ({
    useSession: () => ({
      data: {
        user: { id: "1", name: "", email: "", twoFactorEnabled: false },
        session: { id: "s1", token: "t1" },
      },
      isPending: false,
      refetch: async () => {},
    }),
    twoFactor: {
      enable: async (options: {
        fetchOptions?: { onSuccess?: (ctx: unknown) => void };
      }) =>
        options.fetchOptions?.onSuccess?.({
          data: { totpURI: "otpauth://totp/Test" },
        }),
      disable: async () => {},
      getTotpUri: async () => {},
      verifyTotp: async () => {},
    },
  }) as unknown as AccountContextValue["authClient"];

const toaster = {
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
  promise: async () => {},
} as unknown as AccountContextValue["toaster"];

const renderBlock = () =>
  render(
    <AccountProvider
      authClient={makeClient()}
      toaster={toaster}
      brand={{ organizationName: "Test" }}
    >
      <UserTwoFactorAuthentication />
    </AccountProvider>,
  );

// zag-js reacts to the full pointer sequence, not a bare click.
const press = (element: Element) => {
  fireEvent.pointerDown(element);
  fireEvent.pointerUp(element);
  fireEvent.click(element);
};

describe("UserTwoFactorAuthentication", () => {
  afterEach(() => cleanup());

  test("labels the action 'Verify & activate' after setup starts (before verify)", async () => {
    renderBlock();

    // open the enable dialog
    press(screen.getByRole("button", { name: "Enable 2FA" }));
    const dialog = await screen.findByRole("dialog");

    // the dialog's own submit (also "Enable 2FA") starts setup; scope to the
    // dialog so we do not re-press the trigger
    press(within(dialog).getByRole("button", { name: "Enable 2FA" }));

    // once the TOTP URI comes back, the CTA must guide the user to verify,
    // not still read "Enable 2FA" (which is what made the flow look finished)
    const verify = await screen.findByText("Verify & activate");
    expect(verify).toBeDefined();
  });
});
