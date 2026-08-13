import type { ComponentProps, ReactNode } from "react";
/** Legal links are the same across every Omni product (omni.dev catalog SSOT). */
declare const DEFAULT_LEGAL: {
    privacy: string;
    terms: string;
    cookies: string;
};
interface AppFooterProps extends ComponentProps<"footer"> {
    /** The product's own logomark (inline SVG or icon element). */
    appLogo: ReactNode;
    /**
     * The product's symbol from the Omni product catalog (`products.ts` `icon`,
     * e.g. Fractal "🔷", Kiln "🔥"), shown in the "Made with <symbol> by Omni"
     * credit. Mirror the catalog value; do not invent one.
     */
    appSymbol: string;
    /** Product docs link. Omit to hide the Docs entry. */
    docsUrl?: string;
    /**
     * The product's own social links block (apps render their own brand icons).
     * Omit to hide. Always include Threads (`@omnidotdev`) - the commonly missed one.
     */
    socials?: ReactNode;
    /** Org credited in "by <org>". Defaults to Omni / omni.dev. */
    orgName?: string;
    orgUrl?: string;
    /** Legal link overrides; defaults to the omni.dev/legal SSOT. */
    legal?: Partial<typeof DEFAULT_LEGAL>;
}
/**
 * Standard Omni product footer. Bakes in the parts every Omni app must carry -
 * the "Made with <symbol> by Omni" credit, the Omni mark, the omni.dev link, and
 * the legal links - so they cannot drift or be forgotten. Each app supplies only
 * its own identity: `appLogo`, its catalog `appSymbol`, `docsUrl`, and a
 * `socials` block. The branding is one condensed credit line (app logo,
 * copyright, then "Made with <symbol> by Omni"), never two separate blocks.
 */
declare const AppFooter: ({ appLogo, appSymbol, docsUrl, socials, orgName, orgUrl, legal, className, ...rest }: AppFooterProps) => import("react/jsx-runtime").JSX.Element;
export { AppFooter };
