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

const renderBlock = (
  brand: { organizationName: string; securityDocsUrl?: string } = {
    organizationName: "Test",
  },
) =>
  render(
    <AccountProvider authClient={makeClient()} toaster={toaster} brand={brand}>
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

  test("links out to the security docs when a URL is provided", () => {
    renderBlock({
      organizationName: "Test",
      securityDocsUrl: "https://docs.test.dev/account/security",
    });

    const link = screen.getByRole("link", { name: /learn more/i });
    expect(link.getAttribute("href")).toBe(
      "https://docs.test.dev/account/security",
    );
  });

  test("omits the docs link when no URL is provided", () => {
    renderBlock();

    expect(screen.queryByRole("link", { name: /learn more/i })).toBeNull();
  });

  test("shows the QR code after setup starts", async () => {
    renderBlock();

    press(screen.getByRole("button", { name: "Enable 2FA" }));
    const dialog = await screen.findByRole("dialog");
    press(within(dialog).getByRole("button", { name: "Enable 2FA" }));

    // react-qr-code renders an <svg>; the manual-entry field carries the URI
    await screen.findByText("Verify & activate");
    const svg = document.querySelector("svg[viewBox]");
    expect(svg).not.toBeNull();
  });
});
