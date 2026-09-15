import { afterEach, describe, expect, test } from "bun:test";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { AccountOrganizations } from "@/registry/thornberry/components/account-organizations";
import { AccountProvider } from "@/registry/thornberry/components/account-provider";

import type { AccountContextValue } from "@/registry/thornberry/components/account-provider";

const ORG = { id: "org1", slug: "acme", name: "Acme", type: "team" as const };

const OWNER = {
  id: "m-own",
  role: "owner",
  user: { name: "Olivia Owner", email: "owner@acme.test" },
};

const makeClient = () =>
  ({
    useSession: () => ({
      data: {
        user: { id: "u1", name: "Viewer", email: "owner@acme.test" },
        session: { id: "s1", token: "t1" },
      },
      isPending: false,
      refetch: async () => {},
    }),
    organization: {
      list: async () => ({ data: [ORG] }),
      getFullOrganization: async () => ({
        data: { ...ORG, logo: null, members: [OWNER], invitations: [] },
      }),
      listTeams: async () => ({ data: [] }),
    },
  }) as unknown as AccountContextValue["authClient"];

const toaster = {
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
  promise: async () => {},
} as unknown as AccountContextValue["toaster"];

describe("AccountOrganizations logo upload", () => {
  afterEach(() => cleanup());

  const uploadCalls: Array<{ organizationId: string; file: Blob }> = [];

  const openLogoInput = async (): Promise<HTMLInputElement> => {
    uploadCalls.length = 0;
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

    // Open the workspace editor, where the logo control lives
    fireEvent.click(await screen.findByRole("button", { name: "Edit" }));
    await screen.findByText("Edit workspace");

    // The hidden logo input renders in the dialog portal on document.body
    return document.querySelector('input[type="file"]') as HTMLInputElement;
  };

  test("selecting a logo opens a crop step instead of uploading immediately", async () => {
    const fileInput = await openLogoInput();
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

  test("rejects a file type the avatar would reject too (parity)", async () => {
    const fileInput = await openLogoInput();

    // SVG is outside ALLOWED_IMAGE_TYPES; the logo must accept exactly what the
    // personal avatar accepts, so this is rejected with no crop step
    const svg = new File(["<svg/>"], "logo.svg", { type: "image/svg+xml" });
    fireEvent.change(fileInput, { target: { files: [svg] } });

    await Promise.resolve();
    expect(screen.queryByText("Crop logo")).toBeNull();
    expect(uploadCalls.length).toBe(0);
  });
});
