import { TanStackDevtools } from "@tanstack/react-devtools";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { RootProvider } from "fumadocs-ui/provider/tanstack";

import { FLAGS, isEnabled } from "@/lib/flags/flags";
import appCss from "@/lib/styles/globals.css?url";
import createMetaTags from "@/lib/util/createMetaTags";

import type { PropsWithChildren } from "react";

const fetchMaintenanceMode = createServerFn({ method: "GET" }).handler(
  async () => {
    const maintenanceMode = await isEnabled(FLAGS.MAINTENANCE_MODE, false);
    return { isMaintenanceMode: maintenanceMode };
  },
);

/**
 * Maintenance page for production.
 */
function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-violet-900 to-violet-800 p-8 text-white">
      <div className="text-center">
        <div className="mb-6 text-9xl">🫐</div>
        <h1 className="mb-4 font-bold text-4xl">Berry Good Things Coming</h1>
        <p className="max-w-md text-lg text-violet-200">
          We're picking the best. Thornberry will be ripe again soon.
        </p>
      </div>
    </div>
  );
}

/**
 * Root component.
 */
function RootComponent() {
  const { isMaintenanceMode } = useRouteContext({ from: "__root__" });

  // Show maintenance page when flag is enabled
  if (isMaintenanceMode) {
    return (
      <RootDocument>
        <MaintenancePage />
      </RootDocument>
    );
  }

  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

/**
 * Root route.
 */
export const Route = createRootRouteWithContext<{
  isMaintenanceMode: boolean;
}>()({
  beforeLoad: async () => {
    const { isMaintenanceMode } = await fetchMaintenanceMode();

    return { isMaintenanceMode };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "mobile-web-app-capable", content: "yes" },
      ...createMetaTags(),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
    ],
  }),
  component: RootComponent,
});

/**
 * Root document.
 */
const RootDocument = ({ children }: PropsWithChildren) => (
  <html suppressHydrationWarning lang="en">
    <head>
      <HeadContent />
    </head>

    <body className="flex min-h-screen flex-col">
      <RootProvider>{children}</RootProvider>

      {/* NB: dev tools automatically only included when `NODE_ENV=development` */}
      <TanStackDevtools
        plugins={[
          {
            name: "Router",
            render: <TanStackRouterDevtoolsPanel />,
            defaultOpen: true,
          },
        ]}
      />

      <Scripts />
    </body>
  </html>
);
