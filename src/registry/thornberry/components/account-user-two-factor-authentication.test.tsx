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

const BACKUP_CODES = [
  "aaaa-1111",
  "bbbb-2222",
  "cccc-3333",
  "dddd-4444",
  "eeee-5555",
];
const REGENERATED_CODES = ["wxyz-9999", "vvvv-8888"];

// A minimal client. `enable` starts setup and returns the TOTP URI to scan plus
// the backup codes (better-auth does not activate 2FA until verify-totp), so the
// block should move on to the verification step and surface the codes once the
// user verifies. `twoFactorEnabled` toggles the enabled-account surface.
const makeClient = ({ enabled = false }: { enabled?: boolean } = {}) =>
  ({
    useSession: () => ({
      data: {
        user: { id: "1", name: "", email: "", twoFactorEnabled: enabled },
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
          data: {
            totpURI: "otpauth://totp/Test",
            backupCodes: BACKUP_CODES,
          },
        }),
      disable: async () => {},
      getTotpUri: async () => {},
      verifyTotp: async (options: {
        fetchOptions?: { onSuccess?: (ctx: unknown) => void };
      }) => options.fetchOptions?.onSuccess?.({ data: {} }),
      generateBackupCodes: async (options: {
        fetchOptions?: { onSuccess?: (ctx: unknown) => void };
      }) =>
        options.fetchOptions?.onSuccess?.({
          data: { backupCodes: REGENERATED_CODES },
        }),
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
  client: AccountContextValue["authClient"] = makeClient(),
) =>
  render(
    <AccountProvider authClient={client} toaster={toaster} brand={brand}>
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

  test("surfaces the backup codes after the user verifies, so they can be saved", async () => {
    renderBlock();

    press(screen.getByRole("button", { name: "Enable 2FA" }));
    const dialog = await screen.findByRole("dialog");
    press(within(dialog).getByRole("button", { name: "Enable 2FA" }));

    const codeInput = await screen.findByLabelText(
      /6-digit code from your authenticator/i,
    );
    fireEvent.change(codeInput, { target: { value: "123456" } });
    press(screen.getByRole("button", { name: "Verify & activate" }));

    // every backup code the server returned must be shown to the user
    for (const code of BACKUP_CODES) {
      expect(await screen.findByText(code)).toBeDefined();
    }
  });

  test("starts setup when Enter is pressed in the password field", async () => {
    renderBlock();

    press(screen.getByRole("button", { name: "Enable 2FA" }));
    const dialog = await screen.findByRole("dialog");

    const passwordInput = within(dialog).getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: "hunter2hunter2" } });
    fireEvent.keyDown(passwordInput, { key: "Enter" });

    // Enter must advance the flow (to the verify step) just like clicking
    const verify = await screen.findByText("Verify & activate");
    expect(verify).toBeDefined();
  });

  test("gates closing enrollment until the backup codes are acknowledged", async () => {
    renderBlock();

    press(screen.getByRole("button", { name: "Enable 2FA" }));
    const dialog = await screen.findByRole("dialog");
    press(within(dialog).getByRole("button", { name: "Enable 2FA" }));

    const codeInput = await screen.findByLabelText(
      /6-digit code from your authenticator/i,
    );
    fireEvent.change(codeInput, { target: { value: "123456" } });
    press(screen.getByRole("button", { name: "Verify & activate" }));

    // backup codes are shown; the "Done" button must stay disabled until the
    // user confirms they saved them, so the only recovery codes are not lost
    const done = await screen.findByRole("button", { name: "Done" });
    expect((done as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(await screen.findByLabelText(/saved/i));
    expect((done as HTMLButtonElement).disabled).toBe(false);
  });

  test("regenerates and shows new backup codes when 2FA is enabled", async () => {
    renderBlock({ organizationName: "Test" }, makeClient({ enabled: true }));

    press(screen.getByRole("button", { name: /backup codes/i }));
    const dialog = await screen.findByRole("dialog");

    const passwordInput = within(dialog).getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: "hunter2hunter2" } });
    press(within(dialog).getByRole("button", { name: /regenerate/i }));

    for (const code of REGENERATED_CODES) {
      expect(await screen.findByText(code)).toBeDefined();
    }
  });
});
