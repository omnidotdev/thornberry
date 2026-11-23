import { afterEach, describe, expect, mock, test } from "bun:test";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { AccountProfileSettings } from "@/registry/thornberry/components/account-profile-settings";
import { AccountProvider } from "@/registry/thornberry/components/account-provider";

import type { AccountProfileSettingsProps } from "@/registry/thornberry/components/account-profile-settings";
import type { AccountContextValue } from "@/registry/thornberry/components/account-provider";

const makeClient = () => {
  const updateUser = mock(async () => ({ error: null }));
  const changeEmail = mock(async () => ({ error: null }));
  const refetch = mock(async () => {});

  const client = {
    useSession: () => ({
      data: {
        user: { id: "u1", name: "Ada Lovelace", email: "ada@example.com" },
        session: { id: "s1", token: "t1" },
      },
      isPending: false,
      refetch,
    }),
    updateUser,
    changeEmail,
  } as unknown as AccountContextValue["authClient"];

  return { client, updateUser, changeEmail, refetch };
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
  props: AccountProfileSettingsProps = {},
) =>
  render(
    <AccountProvider
      authClient={client}
      toaster={toaster}
      brand={{ organizationName: "Test" }}
    >
      <AccountProfileSettings {...props} />
    </AccountProvider>,
  );

describe("AccountProfileSettings", () => {
  afterEach(() => cleanup());

  test("saves a changed name through updateUser", async () => {
    const { client, updateUser, refetch } = makeClient();
    const onProfileUpdated = mock(() => {});
    renderBlock(client, { onProfileUpdated });

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Ada King" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(onProfileUpdated).toHaveBeenCalled());
    expect(updateUser).toHaveBeenCalledWith({ name: "Ada King" });
    expect(refetch).toHaveBeenCalled();
  });

  test("hides the username field without an availability check", () => {
    const { client } = makeClient();
    renderBlock(client);

    expect(screen.queryByLabelText("Username")).toBeNull();
  });

  test("saves an available username, lowercased", async () => {
    const { client, updateUser } = makeClient();
    const checkUsernameAvailability = mock(async () => ({ available: true }));
    renderBlock(client, { checkUsernameAvailability });

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "AdaL" },
    });
    await waitFor(
      () => expect(checkUsernameAvailability).toHaveBeenCalledWith("adal"),
      { timeout: 2000 },
    );

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(updateUser).toHaveBeenCalledWith({ username: "adal" }),
    );
  });

  test("requests an email change with the host callback URL", async () => {
    const { client, changeEmail } = makeClient();
    renderBlock(client, { changeEmailCallbackURL: "/account" });

    fireEvent.change(screen.getByLabelText("New email"), {
      target: { value: "ada@new.example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Change email" }));

    await waitFor(() =>
      expect(changeEmail).toHaveBeenCalledWith({
        newEmail: "ada@new.example.com",
        callbackURL: "/account",
      }),
    );
  });
});
