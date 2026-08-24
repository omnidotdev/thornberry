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
declare const NotFoundPage: ({ appName, appLogo, homeHref, homeLabel, showBack, backLabel, description, className, ...rest }: Props) => import("react/jsx-runtime").JSX.Element;
export { NotFoundPage };
