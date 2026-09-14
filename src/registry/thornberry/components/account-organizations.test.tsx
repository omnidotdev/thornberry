import { afterEach, describe, expect, test } from "bun:test";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import { AccountOrganizations } from "@/registry/thornberry/components/account-organizations";
import { AccountProvider } from "@/registry/thornberry/components/account-provider";

import type { AccountContextValue } from "@/registry/thornberry/components/account-provider";

const ORG = { id: "org1", slug: "acme", name: "Acme", type: "team" as const };

const DAY = 24 * 60 * 60 * 1000;
const future = () => new Date(Date.now() + 3 * DAY).toISOString();
const past = () => new Date(Date.now() - 3 * DAY).toISOString();

interface Member {
  id: string;
  role: string;
  user: { name: string; email: string; image?: string | null };
}
interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string | null;
}

/**
 * A mock account client backing the organization block. `inviteCalls` and
 * `roleCalls` capture the mutations the component fires so a test can assert
 * what was sent, and `currentEmail` decides which member the viewer is (and so
 * whether they are an owner or an admin).
 */
const makeClient = ({
  currentEmail,
  members,
  invitations = [],
}: {
  currentEmail: string;
  members: Member[];
  invitations?: Invitation[];
}) => {
  const inviteCalls: Array<{
    email: string;
    role: string;
    organizationId: string;
  }> = [];
  const roleCalls: Array<{ memberId: string; role: string }> = [];
  const cancelCalls: Array<{ invitationId: string }> = [];
  const deleteCalls: Array<{ organizationId: string }> = [];

  const client = {
    useSession: () => ({
      data: {
        user: { id: "u1", name: "Viewer", email: currentEmail },
        session: { id: "s1", token: "t1" },
      },
      isPending: false,
      refetch: async () => {},
    }),
    organization: {
      list: async () => ({ data: [ORG] }),
      getFullOrganization: async () => ({
        data: { ...ORG, logo: null, members, invitations },
      }),
      listTeams: async () => ({ data: [] }),
      inviteMember: async (args: {
        email: string;
        role: string;
        organizationId: string;
      }) => {
        inviteCalls.push(args);
        return { error: null };
      },
      cancelInvitation: async (args: { invitationId: string }) => {
        cancelCalls.push(args);
        return { error: null };
      },
      updateMemberRole: async (args: { memberId: string; role: string }) => {
        roleCalls.push(args);
        return { error: null };
      },
      removeMember: async () => ({ error: null }),
      delete: async (args: { organizationId: string }) => {
        deleteCalls.push(args);
        return { error: null };
      },
    },
  } as unknown as AccountContextValue["authClient"];

  return { client, inviteCalls, roleCalls, cancelCalls, deleteCalls };
};

const toaster = {
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
  promise: async () => {},
} as unknown as AccountContextValue["toaster"];

const renderDetail = (client: AccountContextValue["authClient"]) =>
  render(
    <AccountProvider
      authClient={client}
      toaster={toaster}
      brand={{ organizationName: "Test" }}
    >
      {/* controlled + preselected so the detail (management) view renders */}
      <AccountOrganizations
        selectedSlug="acme"
        onSelectOrganization={() => {}}
      />
    </AccountProvider>,
  );

/** The management-view row wrapping a member/invitation by its visible label. */
const row = (label: string) =>
  within(screen.getByText(label).closest('[class~="p-3"]') as HTMLElement);

const OWNER_SELF: Member = {
  id: "m-self",
  role: "owner",
  user: { name: "Owner One", email: "owner@acme.test" },
};

describe("AccountOrganizations invitations", () => {
  afterEach(() => cleanup());

  test("marks an expired invite 'Expired' and offers Resend, not a plain Cancel", async () => {
    const { client } = makeClient({
      currentEmail: "owner@acme.test",
      members: [OWNER_SELF],
      invitations: [
        {
          id: "inv-live",
          email: "live@acme.test",
          role: "member",
          status: "pending",
          expiresAt: future(),
        },
        {
          id: "inv-exp",
          email: "expired@acme.test",
          role: "admin",
          status: "pending",
          expiresAt: past(),
        },
      ],
    });
    renderDetail(client);

    // the live invite keeps a plain Cancel and carries no Expired badge
    await screen.findByText("live@acme.test");
    expect(row("live@acme.test").queryByText("Expired")).toBeNull();
    expect(
      row("live@acme.test").getByRole("button", { name: "Cancel" }),
    ).toBeTruthy();
    expect(
      row("live@acme.test").queryByRole("button", { name: "Resend" }),
    ).toBeNull();

    // the expired invite is badged and offers Resend + Remove
    const expired = row("expired@acme.test");
    expect(expired.getByText("Expired")).toBeTruthy();
    expect(expired.getByRole("button", { name: "Resend" })).toBeTruthy();
    expect(expired.getByRole("button", { name: "Remove" })).toBeTruthy();
  });

  test("Resend re-invites the expired invite's own email and role", async () => {
    const { client, inviteCalls } = makeClient({
      currentEmail: "owner@acme.test",
      members: [OWNER_SELF],
      invitations: [
        {
          id: "inv-exp",
          email: "expired@acme.test",
          role: "admin",
          status: "pending",
          expiresAt: past(),
        },
      ],
    });
    renderDetail(client);

    fireEvent.click(await screen.findByRole("button", { name: "Resend" }));

    await waitFor(() => expect(inviteCalls.length).toBe(1));
    expect(inviteCalls[0]).toEqual({
      email: "expired@acme.test",
      role: "admin",
      organizationId: "org1",
    });
  });

  test("Remove confirms, then cancels the expired invitation by id", async () => {
    const { client, cancelCalls } = makeClient({
      currentEmail: "owner@acme.test",
      members: [OWNER_SELF],
      invitations: [
        {
          id: "inv-exp",
          email: "expired@acme.test",
          role: "member",
          status: "pending",
          expiresAt: past(),
        },
      ],
    });
    renderDetail(client);

    // Remove opens a confirmation; nothing is cancelled until it is confirmed
    fireEvent.click(await screen.findByRole("button", { name: "Remove" }));
    const confirm = await screen.findByRole("button", {
      name: "Cancel invitation",
    });
    expect(cancelCalls.length).toBe(0);

    fireEvent.click(confirm);
    await waitFor(() => expect(cancelCalls.length).toBe(1));
    expect(cancelCalls[0]).toEqual({ invitationId: "inv-exp" });
  });
});

describe("AccountOrganizations owner-role protection", () => {
  afterEach(() => cleanup());

  const MEMBERS: Member[] = [
    {
      id: "m-own",
      role: "owner",
      user: { name: "Olivia Owner", email: "olivia@acme.test" },
    },
    {
      id: "m-adm",
      role: "admin",
      user: { name: "Adam Admin", email: "adam@acme.test" },
    },
    {
      id: "m-mem",
      role: "member",
      user: { name: "Mia Member", email: "mia@acme.test" },
    },
  ];

  test("an admin sees an owner's role read-only, with no role picker or remove", async () => {
    const { client } = makeClient({
      currentEmail: "adam@acme.test", // viewer is an admin
      members: MEMBERS,
    });
    renderDetail(client);

    await screen.findByText("Olivia Owner");
    const owner = row("Olivia Owner");
    // read-only: the role shows as a static badge, not an editable combobox
    expect(owner.queryByRole("combobox")).toBeNull();
    expect(owner.getByText("owner")).toBeTruthy();
    // and the admin cannot remove the owner
    expect(owner.queryByRole("button", { name: "Remove" })).toBeNull();

    // the same admin CAN still manage a plain member
    expect(row("Mia Member").getByRole("combobox")).toBeTruthy();
  });

  test("an owner can change another (non-last) owner's role", async () => {
    const { client } = makeClient({
      currentEmail: "olivia@acme.test", // viewer is an owner
      members: [
        {
          id: "m-o1",
          role: "owner",
          user: { name: "Olivia Owner", email: "olivia@acme.test" },
        },
        {
          id: "m-o2",
          role: "owner",
          user: { name: "Owen Owner", email: "owen@acme.test" },
        },
      ],
    });
    renderDetail(client);

    await screen.findByText("Owen Owner");
    // two owners, so Owen is not the last owner: his role is editable
    expect(row("Owen Owner").getByRole("combobox")).toBeTruthy();
  });
});

/**
 * Open the given role picker (an Ark Select trigger) and read back the role
 * options it offers. The options render in a portal on `document.body` once the
 * select is open, so they are queried at screen level rather than within a row.
 */
const openRoleOptions = async (trigger: HTMLElement): Promise<string[]> => {
  fireEvent.click(trigger);
  await waitFor(() =>
    expect(screen.queryAllByRole("option").length).toBeGreaterThan(0),
  );
  return screen.queryAllByRole("option").map((option) => option.textContent);
};

describe("AccountOrganizations role-assignment restriction", () => {
  afterEach(() => cleanup());

  const MEMBERS: Member[] = [
    {
      id: "m-own",
      role: "owner",
      user: { name: "Olivia Owner", email: "olivia@acme.test" },
    },
    {
      id: "m-adm",
      role: "admin",
      user: { name: "Adam Admin", email: "adam@acme.test" },
    },
    {
      id: "m-mem",
      role: "member",
      user: { name: "Mia Member", email: "mia@acme.test" },
    },
  ];

  test("an admin is not offered the owner role when changing a member's role", async () => {
    const { client } = makeClient({
      currentEmail: "adam@acme.test", // viewer is an admin
      members: MEMBERS,
    });
    renderDetail(client);

    await screen.findByText("Mia Member");
    const options = await openRoleOptions(
      row("Mia Member").getByRole("combobox"),
    );
    expect(options).not.toContain("owner");
    expect(options).toEqual(["admin", "member"]);
  });

  test("an admin cannot promote their own row to owner", async () => {
    const { client } = makeClient({
      currentEmail: "adam@acme.test", // viewer is an admin, editing themselves
      members: MEMBERS,
    });
    renderDetail(client);

    await screen.findByText("Adam Admin");
    const options = await openRoleOptions(
      row("Adam Admin").getByRole("combobox"),
    );
    expect(options).not.toContain("owner");
  });

  test("an admin is not offered the owner role when inviting", async () => {
    const { client } = makeClient({
      currentEmail: "adam@acme.test", // viewer is an admin
      members: MEMBERS,
    });
    renderDetail(client);

    await screen.findByText("Invite a member");
    const inviteCard = within(
      screen
        .getByText("Invite a member")
        .closest('[class~="p-5"]') as HTMLElement,
    );
    const options = await openRoleOptions(inviteCard.getByRole("combobox"));
    expect(options).not.toContain("owner");
    expect(options).toEqual(["admin", "member"]);
  });

  test("an owner is still offered the owner role", async () => {
    const { client } = makeClient({
      currentEmail: "olivia@acme.test", // viewer is an owner
      members: MEMBERS,
    });
    renderDetail(client);

    await screen.findByText("Mia Member");
    const options = await openRoleOptions(
      row("Mia Member").getByRole("combobox"),
    );
    expect(options).toContain("owner");
  });
});

describe("AccountOrganizations member list", () => {
  afterEach(() => cleanup());

  const MEMBERS: Member[] = [
    {
      id: "m-own",
      role: "owner",
      user: { name: "Olivia Owner", email: "olivia@acme.test" },
    },
    {
      id: "m-mem",
      role: "member",
      user: { name: "Mia Member", email: "mia@acme.test" },
    },
  ];

  test("suffixes '(you)' on the viewer's own row and not on others", async () => {
    const { client } = makeClient({
      currentEmail: "olivia@acme.test",
      members: MEMBERS,
    });
    renderDetail(client);

    await screen.findByText("Olivia Owner");
    expect(row("Olivia Owner").getByText("(you)")).toBeTruthy();
    expect(row("Mia Member").queryByText("(you)")).toBeNull();
  });

  test("search filters the member list by name or email", async () => {
    const { client } = makeClient({
      currentEmail: "olivia@acme.test",
      members: MEMBERS,
    });
    renderDetail(client);

    await screen.findByText("Mia Member");
    fireEvent.change(screen.getByPlaceholderText("Search by name or email"), {
      target: { value: "mia" },
    });

    expect(screen.queryByText("Olivia Owner")).toBeNull();
    expect(screen.getByText("Mia Member")).toBeTruthy();
  });
});

describe("AccountOrganizations delete confirmation", () => {
  afterEach(() => cleanup());

  const OWNER: Member = {
    id: "m-own",
    role: "owner",
    user: { name: "Olivia Owner", email: "olivia@acme.test" },
  };

  test("delete stays disabled until the org name is typed exactly", async () => {
    const { client, deleteCalls } = makeClient({
      currentEmail: "olivia@acme.test",
      members: [OWNER],
    });
    renderDetail(client);

    // Open the danger-zone confirmation (only the trigger exists yet)
    fireEvent.click(
      await screen.findByRole("button", { name: "Delete workspace" }),
    );
    await screen.findByText("Delete Acme?");

    // The confirm button is the disabled one; nothing fires yet
    const confirm = screen
      .getAllByRole("button", { name: "Delete workspace" })
      .find((button) => (button as HTMLButtonElement).disabled) as
      | HTMLButtonElement
      | undefined;
    expect(confirm).toBeTruthy();
    expect(confirm?.disabled).toBe(true);
    expect(deleteCalls.length).toBe(0);

    const input = screen.getByLabelText(/to confirm/i);

    // Wrong case does not satisfy the exact match
    fireEvent.change(input, { target: { value: "acme" } });
    expect(confirm?.disabled).toBe(true);

    // Exact name enables it, and confirming deletes by id
    fireEvent.change(input, { target: { value: "Acme" } });
    await waitFor(() => expect(confirm?.disabled).toBe(false));
    fireEvent.click(confirm as HTMLButtonElement);
    await waitFor(() => expect(deleteCalls.length).toBe(1));
    expect(deleteCalls[0]).toEqual({ organizationId: "org1" });
  });
});

describe("AccountOrganizations scheduled deletion", () => {
  afterEach(() => cleanup());

  const OWNER: Member = {
    id: "m-own",
    role: "owner",
    user: { name: "Olivia Owner", email: "olivia@acme.test" },
  };

  /**
   * A client whose backend supports scheduled deletion. `deletedAt` seeds the
   * org as already scheduled (for the restore/banner test).
   */
  const makeSchedulingClient = (deletedAt?: string) => {
    const org = { ...ORG, logo: null, deletedAt: deletedAt ?? null };
    const scheduleCalls: Array<{ organizationId: string }> = [];
    const restoreCalls: Array<{ organizationId: string }> = [];
    const deleteCalls: Array<{ organizationId: string }> = [];

    const client = {
      useSession: () => ({
        data: {
          user: { id: "u1", name: "Viewer", email: "olivia@acme.test" },
          session: { id: "s1", token: "t1" },
        },
        isPending: false,
        refetch: async () => {},
      }),
      organization: {
        list: async () => ({ data: [org] }),
        getFullOrganization: async () => ({
          data: { ...org, members: [OWNER], invitations: [] },
        }),
        listTeams: async () => ({ data: [] }),
        delete: async (args: { organizationId: string }) => {
          deleteCalls.push(args);
          return { error: null };
        },
        scheduleOrganizationDeletion: async (args: {
          organizationId: string;
        }) => {
          scheduleCalls.push(args);
          return { error: null };
        },
        restoreOrganization: async (args: { organizationId: string }) => {
          restoreCalls.push(args);
          return { error: null };
        },
      },
    } as unknown as AccountContextValue["authClient"];

    return { client, scheduleCalls, restoreCalls, deleteCalls };
  };

  test("delete schedules (not hard-deletes) when the backend supports it", async () => {
    const { client, scheduleCalls, deleteCalls } = makeSchedulingClient();
    renderDetail(client);

    fireEvent.click(
      await screen.findByRole("button", { name: "Delete workspace" }),
    );
    await screen.findByText("Delete Acme?");
    const confirm = screen
      .getAllByRole("button", { name: "Delete workspace" })
      .find((button) => (button as HTMLButtonElement).disabled) as
      | HTMLButtonElement
      | undefined;
    fireEvent.change(screen.getByLabelText(/to confirm/i), {
      target: { value: "Acme" },
    });
    await waitFor(() => expect(confirm?.disabled).toBe(false));
    fireEvent.click(confirm as HTMLButtonElement);

    await waitFor(() => expect(scheduleCalls.length).toBe(1));
    expect(scheduleCalls[0]).toEqual({ organizationId: "org1" });
    expect(deleteCalls.length).toBe(0);
  });

  test("a scheduled org shows a restore banner that calls restoreOrganization", async () => {
    const { client, restoreCalls } = makeSchedulingClient(
      new Date().toISOString(),
    );
    renderDetail(client);

    await screen.findByText("Scheduled for deletion");
    // Restore is owner-gated, so it appears once getFullOrganization resolves
    fireEvent.click(await screen.findByRole("button", { name: "Restore" }));
    await waitFor(() => expect(restoreCalls.length).toBe(1));
    expect(restoreCalls[0]).toEqual({ organizationId: "org1" });
  });
});
