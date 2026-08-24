import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

interface Props extends ComponentProps<"div"> {
  /**
   * Product name shown as the wordmark above the 404. Required: it is the
   * branding fallback for apps with no logomark asset, so the page is never
   * unbranded.
   */
  appName: ReactNode;
  /**
   * Product logomark rendered beside the name (the same asset the app header
   * uses). Omit for wordmark-only branding. Never an emoji stand-in.
   */
  appLogo?: ReactNode;
  /** Where "Go home" points. Defaults to the app root. */
  homeHref?: string;
  /** "Go home" label. */
  homeLabel?: string;
  /** Render the "Go back" button (browser history). Omit to hide it. */
  showBack?: boolean;
  /** "Go back" label. */
  backLabel?: string;
  /** Secondary copy under the 404. Uniform default; override per app if needed. */
  description?: ReactNode;
}

/**
 * Standard Omni 404 page. Renders in-shell (inherits the app's globals and
 * theme), leads with the app's own branding (logomark plus wordmark, or the
 * wordmark alone when no mark is supplied), shows a prominent "404", and offers
 * a way back. Presentational and router-agnostic: navigation uses a plain
 * anchor and browser history so it drops into any app without a router
 * dependency. Wire it on BOTH the `__root` route (`notFoundComponent`, so a
 * thrown `notFound()` renders in-shell) and the router
 * (`defaultNotFoundComponent`, so unmatched routes render it).
 */
const NotFoundPage = ({
  appName,
  appLogo,
  homeHref = "/",
  homeLabel = "Go home",
  showBack = true,
  backLabel = "Go back",
  description = "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
  className,
  ...rest
}: Props) => (
  <div
    data-slot="not-found"
    className={cn(
      "flex min-h-screen w-full flex-col items-center justify-center gap-6 p-6 text-center",
      className,
    )}
    {...rest}
  >
    <div className="flex items-center gap-2">
      {appLogo}

      <span className="font-semibold text-foreground text-lg tracking-tight">
        {appName}
      </span>
    </div>

    <div className="flex flex-col items-center gap-2">
      <h1 className="font-bold text-7xl text-foreground tabular-nums tracking-tight">
        404
      </h1>

      <h2 className="font-semibold text-2xl text-foreground">Page not found</h2>

      <p className="max-w-md text-muted-foreground">{description}</p>
    </div>

    <div className="flex flex-wrap items-center justify-center gap-2">
      {showBack && (
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-lg border border-border bg-card px-4 py-2 font-medium text-foreground text-sm transition-colors hover:bg-accent"
        >
          {backLabel}
        </button>
      )}

      <a
        href={homeHref}
        className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
      >
        {homeLabel}
      </a>
    </div>
  </div>
);

export { NotFoundPage };
