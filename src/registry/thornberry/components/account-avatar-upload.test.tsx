import { afterEach, describe, expect, test } from "bun:test";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { AvatarUpload } from "@/registry/thornberry/components/account-avatar-upload";
import { AccountProvider } from "@/registry/thornberry/components/account-provider";

import type { AccountContextValue } from "@/registry/thornberry/components/account-provider";

const makeClient = () =>
  ({
    useSession: () => ({
      data: {
        user: { id: "u1", name: "Viewer", image: "https://example.test/a.png" },
      },
      refetch: async () => {},
    }),
  }) as unknown as AccountContextValue["authClient"];

const toaster = {
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
  promise: async () => {},
} as unknown as AccountContextValue["toaster"];

describe("AvatarUpload remove confirmation", () => {
  afterEach(() => cleanup());

  test("Remove photo confirms before clearing (parity with the workspace logo)", async () => {
    const clears: number[] = [];

    render(
      <AccountProvider
        authClient={makeClient()}
        toaster={toaster}
        brand={{ organizationName: "Test" }}
      >
        <AvatarUpload
          onUpload={async () => {}}
          onClear={async () => {
            clears.push(1);
          }}
        />
      </AccountProvider>,
    );

    // Open the edit dialog (the avatar wrapper is a button when editable)
    fireEvent.click(screen.getByRole("button"));

    // Removing does not fire immediately: it opens a confirmation first
    fireEvent.click(
      await screen.findByRole("button", { name: "Remove photo" }),
    );
    await screen.findByText("Remove profile photo?");
    expect(clears.length).toBe(0);

    // Confirming performs the clear. The confirm modal stacks on the menu
    // dialog, so the menu is aria-hidden underneath; query with hidden and
    // anchor the name so it does not also match the "Remove photo" button
    fireEvent.click(
      screen.getByRole("button", { name: /^Remove$/, hidden: true }),
    );
    await waitFor(() => expect(clears.length).toBe(1));
  });
});
