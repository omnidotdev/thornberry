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

import type {
  AccountContextValue,
  AccountOrgBannerUploader,
} from "@/registry/thornberry/components/account-provider";

const BANNER_URL = "https://example.test/banner.jpg";

interface UpdateCall {
  organizationId: string;
  data: { banner?: string | null };
}

const makeClient = ({
  banner = null,
  role = "owner",
  type = "team",
  updateCalls,
}: {
  banner?: string | null;
  role?: string;
  type?: string;
  updateCalls?: UpdateCall[];
} = {}) => {
  const org = { id: "org1", slug: "acme", name: "Acme", type, banner };
  const viewer = {
    id: "m-viewer",
    role,
    user: { name: "Viewer", email: "viewer@acme.test" },
  };
  // Return stable object identities across calls: a fresh identity each fetch
  // drives an infinite refetch/re-render loop in the console
  const fullOrg = { ...org, members: [viewer], invitations: [] };
  const listData = [org];
  const teamsData: never[] = [];

  return {
    useSession: () => ({
      data: {
        user: { id: "u1", name: "Viewer", email: "viewer@acme.test" },
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

const makeToaster = (errors: string[] = []) =>
  ({
    success: () => {},
    error: ({ title }: { title: string }) => {
      errors.push(title);
    },
    info: () => {},
    warning: () => {},
    promise: async () => {},
  }) as unknown as AccountContextValue["toaster"];

const renderConsole = ({
  client = makeClient(),
  toaster = makeToaster(),
  orgBanner,
}: {
  client?: AccountContextValue["authClient"];
  toaster?: AccountContextValue["toaster"];
  orgBanner?: AccountOrgBannerUploader;
} = {}) =>
  render(
    <AccountProvider
      authClient={client}
      toaster={toaster}
      brand={{ organizationName: "Test" }}
      orgBanner={orgBanner}
    >
      <AccountOrganizations
        selectedSlug="acme"
        onSelectOrganization={() => {}}
      />
    </AccountProvider>,
  );

const bannerInput = () =>
  document.querySelector(
    'input[type="file"][aria-label="Banner image"]',
  ) as HTMLInputElement | null;

/**
 * Wait for the full workspace (members included) to load, so role-based gating
 * has resolved before asserting an absence
 */
const waitForDetail = () => screen.findAllByText("viewer@acme.test");

describe("AccountOrganizations banner gating", () => {
  afterEach(() => cleanup());

  test("renders no banner editor when the host does not wire an uploader", async () => {
    renderConsole({ client: makeClient({ banner: BANNER_URL }) });
    await waitForDetail();

    expect(
      screen.queryByRole("button", { name: "Workspace banner" }),
    ).toBeNull();
    expect(screen.queryByRole("img", { name: "Workspace banner" })).toBeNull();
    expect(bannerInput()).toBeNull();
  });

  test("owners get an editable banner with a placeholder when unset", async () => {
    renderConsole({
      orgBanner: { uploadEnabled: true, onUpload: async () => {} },
    });

    const banner = await screen.findByRole("button", {
      name: "Workspace banner",
    });
    expect(within(banner).getByText("Add a banner")).toBeTruthy();
  });

  test("members see the banner read-only", async () => {
    renderConsole({
      client: makeClient({ banner: BANNER_URL, role: "member" }),
      orgBanner: { uploadEnabled: true, onUpload: async () => {} },
    });

    const image = await screen.findByRole("img", { name: "Workspace banner" });
    expect(image.getAttribute("src")).toBe(BANNER_URL);
    expect(
      screen.queryByRole("button", { name: "Workspace banner" }),
    ).toBeNull();
  });

  test("members see nothing when the workspace has no banner", async () => {
    renderConsole({
      client: makeClient({ role: "member" }),
      orgBanner: { uploadEnabled: true, onUpload: async () => {} },
    });
    await waitForDetail();

    expect(
      screen.queryByRole("button", { name: "Workspace banner" }),
    ).toBeNull();
    expect(screen.queryByText("Add a banner")).toBeNull();
  });

  test("personal workspaces are not editable, matching the logo", async () => {
    renderConsole({
      client: makeClient({ type: "personal" }),
      orgBanner: { uploadEnabled: true, onUpload: async () => {} },
    });
    await waitForDetail();

    expect(
      screen.queryByRole("button", { name: "Workspace banner" }),
    ).toBeNull();
  });
});

describe("AccountOrganizations banner upload", () => {
  afterEach(() => cleanup());

  test("selecting a banner opens a crop step instead of uploading immediately", async () => {
    const uploadCalls: Array<{ organizationId: string; file: Blob }> = [];

    renderConsole({
      orgBanner: {
        uploadEnabled: true,
        onUpload: async (organizationId, file) => {
          uploadCalls.push({ organizationId, file });
        },
      },
    });

    fireEvent.click(
      await screen.findByRole("button", { name: "Workspace banner" }),
    );
    await screen.findByRole("button", { name: "Upload new banner" });

    const input = bannerInput();
    expect(input).toBeTruthy();

    const file = new File([new Uint8Array([1, 2, 3])], "wide.png", {
      type: "image/png",
    });
    fireEvent.change(input as HTMLInputElement, { target: { files: [file] } });

    // The raw file must be cropped to 4:1 before anything is uploaded
    await screen.findByText("Crop banner");
    expect(uploadCalls.length).toBe(0);
  });

  test("rejects a banner over 10 MB before cropping", async () => {
    const errors: string[] = [];

    renderConsole({
      toaster: makeToaster(errors),
      orgBanner: { uploadEnabled: true, onUpload: async () => {} },
    });

    fireEvent.click(
      await screen.findByRole("button", { name: "Workspace banner" }),
    );
    await screen.findByRole("button", { name: "Upload new banner" });

    const oversized = new File(
      [new Uint8Array(10 * 1024 * 1024 + 1)],
      "huge.png",
      { type: "image/png" },
    );
    fireEvent.change(bannerInput() as HTMLInputElement, {
      target: { files: [oversized] },
    });

    await waitFor(() => expect(errors).toContain("File too large"));
    expect(screen.queryByText("Crop banner")).toBeNull();
  });

  test("rejects a disallowed file type before cropping", async () => {
    const errors: string[] = [];

    renderConsole({
      toaster: makeToaster(errors),
      orgBanner: { uploadEnabled: true, onUpload: async () => {} },
    });

    fireEvent.click(
      await screen.findByRole("button", { name: "Workspace banner" }),
    );
    await screen.findByRole("button", { name: "Upload new banner" });

    const svg = new File(["<svg/>"], "banner.svg", { type: "image/svg+xml" });
    fireEvent.change(bannerInput() as HTMLInputElement, {
      target: { files: [svg] },
    });

    await waitFor(() => expect(errors).toContain("Invalid file type"));
    expect(screen.queryByText("Crop banner")).toBeNull();
  });
});

describe("AccountOrganizations banner removal", () => {
  afterEach(() => cleanup());

  test("Remove confirms, then clears the banner via organization.update(banner:null)", async () => {
    const updateCalls: UpdateCall[] = [];

    renderConsole({
      client: makeClient({ banner: BANNER_URL, updateCalls }),
      orgBanner: { uploadEnabled: true, onUpload: async () => {} },
    });

    fireEvent.click(
      await screen.findByRole("button", { name: "Workspace banner" }),
    );

    // Removing does not fire immediately: it opens a confirmation first
    fireEvent.click(
      await screen.findByRole("button", { name: "Remove banner" }),
    );
    const confirmTitle = await screen.findByText("Remove workspace banner?");
    expect(updateCalls.length).toBe(0);

    // The confirm modal stacks over the banner menu (aria-hidden underneath),
    // so scope the click to it and query with hidden as well
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
      data: { banner: null },
      organizationId: "org1",
    });
  });
});
