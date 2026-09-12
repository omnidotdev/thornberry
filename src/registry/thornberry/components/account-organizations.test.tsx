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
    },
  } as unknown as AccountContextValue["authClient"];

  return { client, inviteCalls, roleCalls, cancelCalls };
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
