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

const OWNER = {
  id: "m-own",
  role: "owner",
  user: { name: "Olivia Owner", email: "owner@acme.test" },
};

interface UpdateCall {
  organizationId: string;
  data: { logo?: string | null };
}

const makeClient = ({
  logo = null,
  updateCalls,
}: {
  logo?: string | null;
  updateCalls?: UpdateCall[];
} = {}) => {
  // Return stable object identities across calls: a fresh identity each fetch
  // drives an infinite refetch/re-render loop in the console
  const listOrg = { ...ORG, logo };
  const fullOrg = { ...ORG, logo, members: [OWNER], invitations: [] };
  const listData = [listOrg];
  const teamsData: never[] = [];

  return {
    useSession: () => ({
      data: {
        user: { id: "u1", name: "Viewer", email: "owner@acme.test" },
        session: { id: "s1", token: "t1" },
      },
      isPending: false,
      refetch: async () => {},
    }),
    organization: {
      list: async () => ({ data: listData }),
      getFullOrganization: async () => ({ data: fullOrg }),
      listTeams: async () => ({ data: teamsData }),
      update: async (options: UpdateCall) => {
        updateCalls?.push(options);
        return { error: null };
      },
    },
  } as unknown as AccountContextValue["authClient"];
};

const toaster = {
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
  promise: async () => {},
} as unknown as AccountContextValue["toaster"];

// NB: leaving the edit dialog as the only open modal makes happy-dom churn Ark's
// focus trap without settling, so each test here opens a second surface (the
// crop or confirm dialog) that resolves it. The pure file-type parity assertion
// lives in lib/crop.test.ts to avoid that render entirely.

describe("AccountOrganizations logo upload", () => {
  afterEach(() => cleanup());

  test("selecting a logo opens a crop step instead of uploading immediately", async () => {
    const uploadCalls: Array<{ organizationId: string; file: Blob }> = [];

    render(
      <AccountProvider
        authClient={makeClient()}
        toaster={toaster}
        brand={{ organizationName: "Test" }}
        orgLogo={{
          uploadEnabled: true,
          onUpload: async (organizationId: string, file: Blob) => {
            uploadCalls.push({ organizationId, file });
          },
        }}
      >
        <AccountOrganizations
          selectedSlug="acme"
          onSelectOrganization={() => {}}
        />
      </AccountProvider>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Edit" }));
    await screen.findByText("Edit workspace");

    // The hidden logo input renders in the dialog portal on document.body
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    expect(fileInput).toBeTruthy();

    const file = new File([new Uint8Array([1, 2, 3])], "pic.png", {
      type: "image/png",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // The crop step appears, and nothing has been uploaded yet: the raw file
    // must be cropped first (the regression was uploading it uncropped)
    await screen.findByText("Crop logo");
    expect(uploadCalls.length).toBe(0);
  });
});

describe("AccountOrganizations logo removal", () => {
  afterEach(() => cleanup());

  test("Remove confirms, then clears the logo via organization.update(logo:null)", async () => {
    const updateCalls: UpdateCall[] = [];

    render(
      <AccountProvider
        authClient={makeClient({
          logo: "https://example.test/logo.png",
          updateCalls,
        })}
        toaster={toaster}
        brand={{ organizationName: "Test" }}
        orgLogo={{ uploadEnabled: true, onUpload: async () => {} }}
      >
        <AccountOrganizations
          selectedSlug="acme"
          onSelectOrganization={() => {}}
        />
      </AccountProvider>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Edit" }));
    await screen.findByText("Edit workspace");

    // Removing does not fire immediately: it opens a confirmation first
    fireEvent.click(await screen.findByRole("button", { name: "Remove" }));
    const confirmTitle = await screen.findByText("Remove logo?");
    expect(updateCalls.length).toBe(0);

    // Scope the confirm click to the confirm dialog: the edit dialog behind it
    // also has a "Remove" (logo) button, so a global query would be ambiguous.
    // The confirm modal stacks over the edit dialog (aria-hidden underneath),
    // so query with hidden as well
    const confirmDialog = confirmTitle.closest(
      '[role="dialog"]',
    ) as HTMLElement;
    fireEvent.click(
      within(confirmDialog).getByRole("button", {
        name: /^Remove$/,
        hidden: true,
      }),
    );

    await waitFor(() => expect(updateCalls.length).toBe(1));
    expect(updateCalls[0]).toEqual({
      data: { logo: null },
      organizationId: "org1",
    });
  });
});
