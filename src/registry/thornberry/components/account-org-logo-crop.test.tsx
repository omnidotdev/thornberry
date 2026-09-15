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

    // Open the workspace editor, where the logo control lives
    fireEvent.click(await screen.findByRole("button", { name: "Edit" }));
    await screen.findByText("Edit workspace");

    // Pick an image file via the hidden logo input (rendered in the dialog
    // portal on document.body, not inside the render container)
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
