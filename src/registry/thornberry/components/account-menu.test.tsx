import { afterEach, describe, expect, mock, test } from "bun:test";

import { act, cleanup, fireEvent, render } from "@testing-library/react";

import {
  AccountMenu,
  AccountMenuItem,
  getInitials,
} from "@/registry/thornberry/components/account-menu";

afterEach(() => {
  cleanup();
});

const user = { name: "Ada Lovelace", email: "ada@example.com", image: null };

/** Open the menu the way a click on the avatar does */
const open = async () => {
  const trigger = document.querySelector<HTMLButtonElement>(
    "[aria-label='Open account menu']",
  );
  if (!trigger) throw new Error("expected the avatar trigger");

  await act(async () => {
    fireEvent.click(trigger);
  });

  return trigger;
};

describe("getInitials", () => {
  test("takes the first letters of the first and last words", () => {
    expect(getInitials("Ada King Lovelace")).toBe("AL");
  });

  test("takes one letter from a single-word name", () => {
    expect(getInitials("ada")).toBe("A");
  });

  test("falls back to the email, then a question mark", () => {
    expect(getInitials("  ", "zed@example.com")).toBe("Z");
    expect(getInitials(null, null)).toBe("?");
  });

  test("keeps an astral character whole", () => {
    expect(getInitials("😀 Smile")).toBe("😀S");
  });
});

describe("AccountMenu", () => {
  test("shows the user's initials while no avatar image is set", () => {
    render(<AccountMenu user={user} onSignOut={() => {}} />);

    expect(document.body.textContent).toContain("AL");
  });

  test("gives the trigger a pointer cursor and a keyboard focus ring", () => {
    render(<AccountMenu user={user} onSignOut={() => {}} />);

    const trigger = document.querySelector("[aria-label='Open account menu']");

    expect(trigger?.className).toContain("cursor-pointer");
    expect(trigger?.className).toContain("focus-visible:ring-2");
  });

  test("opens to the user's name and email, the app's entries, and Sign out", async () => {
    render(
      <AccountMenu user={user} onSignOut={() => {}}>
        <AccountMenuItem value="/profile" asChild>
          <a href="/profile">Profile</a>
        </AccountMenuItem>
      </AccountMenu>,
    );

    const trigger = await open();

    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[role='menuitem']"),
    ).map((item) => item.textContent?.trim());

    expect(items).toEqual(["Profile", "Sign out"]);
    expect(document.body.textContent).toContain("Ada Lovelace");
    expect(document.body.textContent).toContain("ada@example.com");
  });

  test("every entry shows a pointer cursor", async () => {
    render(
      <AccountMenu user={user} onSignOut={() => {}}>
        <AccountMenuItem value="/profile">Profile</AccountMenuItem>
      </AccountMenu>,
    );

    await open();

    for (const item of document.querySelectorAll("[role='menuitem']")) {
      expect(item.className).toContain("cursor-pointer");
    }
  });

  test("opens from the keyboard with the first entry highlighted", async () => {
    render(
      <AccountMenu user={user} onSignOut={() => {}}>
        <AccountMenuItem value="/profile">Profile</AccountMenuItem>
      </AccountMenu>,
    );

    const trigger = document.querySelector<HTMLButtonElement>(
      "[aria-label='Open account menu']",
    );
    if (!trigger) throw new Error("expected the avatar trigger");

    await act(async () => {
      trigger.focus();
    });
    await act(async () => {
      fireEvent.keyDown(trigger, { key: "ArrowDown" });
    });

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(
      document.querySelector("[role='menuitem'][data-highlighted]")
        ?.textContent,
    ).toBe("Profile");
  });

  test("links to the account hub in a new tab when given its url", async () => {
    render(
      <AccountMenu
        user={user}
        onSignOut={() => {}}
        manageAccountUrl="https://account.example.com"
      />,
    );

    await open();

    const hub = document.querySelector<HTMLAnchorElement>(
      "a[href='https://account.example.com']",
    );

    expect(hub?.textContent).toContain("Manage account");
    expect(hub?.target).toBe("_blank");
    expect(hub?.rel).toBe("noreferrer");
  });

  test("signs out when Sign out is chosen", async () => {
    const onSignOut = mock(() => {});

    render(<AccountMenu user={user} onSignOut={onSignOut} />);

    await open();

    const signOut = Array.from(
      document.querySelectorAll<HTMLElement>("[role='menuitem']"),
    ).find((item) => item.textContent?.includes("Sign out"));
    if (!signOut) throw new Error("expected a Sign out entry");

    // A real press highlights the item before the click selects it
    await act(async () => {
      fireEvent.pointerMove(signOut, { pointerType: "mouse" });
    });
    await act(async () => {
      fireEvent.click(signOut);
    });

    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  test("heads the menu with the email when the name is blank", async () => {
    render(
      <AccountMenu
        user={{ name: " ", email: "ada@example.com" }}
        onSignOut={() => {}}
      />,
    );

    await open();

    expect(document.body.textContent).toContain("ada@example.com");
    expect(document.body.textContent).toContain("A");
  });
});
