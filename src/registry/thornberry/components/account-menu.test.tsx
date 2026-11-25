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

  test("offers Switch account only when the app handles it", async () => {
    const onSwitchAccount = mock(() => {});

    render(
      <AccountMenu
        user={user}
        onSignOut={() => {}}
        onSwitchAccount={onSwitchAccount}
      />,
    );

    await open();

    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[role='menuitem']"),
    );
    const switchAccount = items.find((item) =>
      item.textContent?.includes("Switch account"),
    );
    if (!switchAccount) throw new Error("expected a Switch account entry");
    // Just above Sign out
    expect(items.at(-1)?.textContent).toContain("Sign out");
    expect(items.at(-2)).toBe(switchAccount);

    await act(async () => {
      fireEvent.pointerMove(switchAccount, { pointerType: "mouse" });
    });
    await act(async () => {
      fireEvent.click(switchAccount);
    });

    expect(onSwitchAccount).toHaveBeenCalledTimes(1);
  });

  test("has no Switch account without a handler", async () => {
    render(<AccountMenu user={user} onSignOut={() => {}} />);

    await open();

    expect(document.body.textContent).not.toContain("Switch account");
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

  test("the sidebar row shows the user's name and email and opens the same menu", async () => {
    const onSignOut = mock(() => {});

    render(
      <AccountMenu variant="sidebar" user={user} onSignOut={onSignOut}>
        <AccountMenuItem value="/profile">Profile</AccountMenuItem>
      </AccountMenu>,
    );

    const trigger = document.querySelector<HTMLButtonElement>(
      "[aria-haspopup='menu']",
    );
    if (!trigger) throw new Error("expected the sidebar row trigger");

    // Named by its visible text, so the label matches what is on screen
    expect(trigger.getAttribute("aria-label")).toBeNull();
    expect(trigger.textContent).toContain("Ada Lovelace");
    expect(trigger.textContent).toContain("ada@example.com");
    expect(trigger.className).toContain("cursor-pointer");

    await act(async () => {
      fireEvent.click(trigger);
    });

    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[role='menuitem']"),
    ).map((item) => item.textContent?.trim());

    expect(items).toEqual(["Profile", "Sign out"]);
  });

  test("a collapsed icon sidebar keeps the row's name for screen readers", () => {
    render(
      <div data-collapsible="icon" className="group">
        <AccountMenu variant="sidebar" user={user} onSignOut={() => {}} />
      </div>,
    );

    const name = Array.from(document.querySelectorAll("span")).find(
      (span) => span.textContent === "Ada Lovelaceada@example.com",
    );

    expect(name?.className).toContain("group-data-[collapsible=icon]:sr-only");
    expect(name?.className).not.toContain(
      "group-data-[collapsible=icon]:hidden",
    );
  });

  describe("other accounts on the browser", () => {
    const grace = {
      id: "h-grace",
      name: "Grace Hopper",
      email: "grace@example.com",
    };
    const alan = {
      id: "h-alan",
      name: "Alan Turing",
      email: "alan@example.com",
    };
    // The signed-in user's own entry, as a remembered-accounts list includes it
    const self = {
      id: "h-ada",
      name: "Ada Lovelace",
      email: "ADA@example.com",
    };

    const menuItems = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[role='menuitem']"));

    const choose = async (item: HTMLElement) => {
      await act(async () => {
        fireEvent.pointerMove(item, { pointerType: "mouse" });
      });
      await act(async () => {
        fireEvent.click(item);
      });
    };

    test("lists the other accounts, leaving out the signed-in one", async () => {
      render(
        <AccountMenu
          user={user}
          onSignOut={() => {}}
          onSwitchAccount={() => {}}
          accounts={[self, grace, alan]}
          onSelectAccount={() => {}}
          onSignOutAll={() => {}}
        />,
      );

      await open();

      expect(menuItems().map((item) => item.textContent?.trim())).toEqual([
        "GHGrace Hoppergrace@example.com",
        "ATAlan Turingalan@example.com",
        "Switch account",
        "Sign out",
        "Sign out of all accounts",
      ]);
    });

    test("switches to an account in one click", async () => {
      const onSelectAccount = mock(() => {});

      render(
        <AccountMenu
          user={user}
          onSignOut={() => {}}
          accounts={[grace]}
          onSelectAccount={onSelectAccount}
        />,
      );

      await open();

      const entry = menuItems().find((item) =>
        item.textContent?.includes("Grace Hopper"),
      );
      if (!entry) throw new Error("expected Grace's entry");
      await choose(entry);

      expect(onSelectAccount).toHaveBeenCalledWith(grace);
    });

    test("splits sign-out into this account and all accounts", async () => {
      const onSignOut = mock(() => {});
      const onSignOutAll = mock(() => {});

      render(
        <AccountMenu
          user={user}
          onSignOut={onSignOut}
          accounts={[grace]}
          onSelectAccount={() => {}}
          onSignOutAll={onSignOutAll}
        />,
      );

      await open();

      const signOutAll = menuItems().find(
        (item) => item.textContent?.trim() === "Sign out of all accounts",
      );
      if (!signOutAll) throw new Error("expected Sign out of all accounts");
      await choose(signOutAll);

      expect(onSignOutAll).toHaveBeenCalledTimes(1);
      expect(onSignOut).not.toHaveBeenCalled();
    });

    test("offers a single Sign out when no other account is signed in", async () => {
      render(
        <AccountMenu
          user={user}
          onSignOut={() => {}}
          accounts={[self]}
          onSelectAccount={() => {}}
          onSignOutAll={() => {}}
        />,
      );

      await open();

      expect(menuItems().map((item) => item.textContent?.trim())).toEqual([
        "Sign out",
      ]);
    });

    test("lists no accounts when the app cannot switch to them", async () => {
      render(
        <AccountMenu
          user={user}
          onSignOut={() => {}}
          accounts={[grace]}
          onSignOutAll={() => {}}
        />,
      );

      await open();

      expect(menuItems().map((item) => item.textContent?.trim())).toEqual([
        "Sign out",
        "Sign out of all accounts",
      ]);
    });
  });
});
