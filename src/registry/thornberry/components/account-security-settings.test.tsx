import { afterEach, describe, expect, mock, test } from "bun:test";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { AccountProvider } from "@/registry/thornberry/components/account-provider";
import {
  AccountSecuritySettings,
  formatActiveSessions,
} from "@/registry/thornberry/components/account-security-settings";

import type { AccountContextValue } from "@/registry/thornberry/components/account-provider";

const CHROME_MAC =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

const makeClient = () => {
  const changePassword = mock(async () => ({ error: null }));

  const client = {
    useSession: () => ({
      data: {
        user: { id: "u1", name: "Ada", email: "ada@example.com" },
        session: { id: "s1", token: "t1" },
      },
      isPending: false,
      refetch: async () => {},
    }),
    useListPasskeys: () => ({ data: [], isPending: false }),
    changePassword,
    passkey: { addPasskey: async () => null, deletePasskey: async () => {} },
    twoFactor: {},
  } as unknown as AccountContextValue["authClient"];

  return { client, changePassword };
};

const toaster = {
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
  promise: async () => {},
} as unknown as AccountContextValue["toaster"];

const renderBlock = (
  client: AccountContextValue["authClient"],
  props: Parameters<typeof AccountSecuritySettings>[0] = {},
) =>
  render(
    <AccountProvider
      authClient={client}
      toaster={toaster}
      brand={{ organizationName: "Test" }}
    >
      <AccountSecuritySettings {...props} />
    </AccountProvider>,
  );

const fill = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe("AccountSecuritySettings", () => {
  afterEach(() => cleanup());

  test("enables the password change only once the form is valid", async () => {
    const { client, changePassword } = makeClient();
    renderBlock(client);

    const submit = screen.getByRole("button", { name: "Change password" });
    expect(submit.hasAttribute("disabled")).toBe(true);

    fill("Current password", "old-password");
    fill("New password", "short");
    expect(screen.getByText("Must be at least 12 characters")).toBeDefined();

    fill("New password", "a-much-longer-password");
    fill("Confirm new password", "a-much-longer-password");
    expect(submit.hasAttribute("disabled")).toBe(false);

    fireEvent.click(submit);

    await waitFor(() =>
      expect(changePassword).toHaveBeenCalledWith({
        currentPassword: "old-password",
        newPassword: "a-much-longer-password",
      }),
    );
  });

  test("requires every host password rule to be met", () => {
    const { client } = makeClient();
    renderBlock(client, {
      passwordRequirements: (password) => [
        { label: "Has a digit", met: /\d/.test(password) },
      ],
    });

    fill("Current password", "old-password");
    fill("New password", "nodigits");
    fill("Confirm new password", "nodigits");

    expect(screen.getByText("Has a digit")).toBeDefined();
    expect(
      screen
        .getByRole("button", { name: "Change password" })
        .hasAttribute("disabled"),
    ).toBe(true);
  });

  test("renders the host sessions notice in place of the list", () => {
    const { client } = makeClient();
    renderBlock(client, {
      sessionsNotice: <p>Sign in again to see devices</p>,
    });

    expect(screen.getByText("Sign in again to see devices")).toBeDefined();
  });
});

describe("formatActiveSessions", () => {
  test("labels devices, marks the current one, and skips agentless sessions", () => {
    const sessions = formatActiveSessions(
      [
        { id: "s1", token: "t1", userAgent: CHROME_MAC, ipAddress: "10.0.0.1" },
        { id: "s2", token: "t2", userAgent: null },
      ],
      "s1",
    );

    expect(sessions).toHaveLength(1);
    expect(sessions[0]?.deviceType).toBe("desktop");
    expect(sessions[0]?.label).toBe("macOS (Chrome) · This device · 10.0.0.1");
  });
});
