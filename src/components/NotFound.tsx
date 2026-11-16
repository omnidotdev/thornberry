import { Link } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";

import app from "@/lib/config/app.config";

/**
 * 404 not found.
 */
const NotFound = () => (
  <HomeLayout
    nav={{
      title: app.name,
    }}
    className="text-center"
  >
    <div className="mt-18 flex flex-col items-center gap-4">
      <h1 className="text-fd-muted-foreground text-6xl font-bold">404</h1>

      <h2 className="text-2xl font-semibold">Page Not Found</h2>

      <p className="text-fd-muted-foreground max-w-md">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      <Link
        to="/$"
        className="bg-fd-primary text-fd-primary-foreground mt-4 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
      >
        Return Home
      </Link>
    </div>
  </HomeLayout>
);

export default NotFound;
