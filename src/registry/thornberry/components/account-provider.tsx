import { createContext, useContext } from "react";

import type { ReactNode } from "react";

/**
 * Branding and copy the account console renders. Every field is host-supplied so
 * the console carries no product-specific identity of its own: a deployment
 * fills these from its own configuration.
 */
export interface AccountBrand {
  /** Product or organization display name, shown in copy */
  organizationName: string;
  /** Support email surfaced in the console footer */
  supportEmail?: string;
  /** Community or support link surfaced in the console footer */
  supportUrl?: string;
  /** Docs link explaining account security (e.g. two-factor setup) */
  securityDocsUrl?: string;
  /** Placeholder email shown in email inputs */
  placeholderEmail?: string;
  /** Privacy policy link */
  privacyPolicyUrl?: string;
  /** Terms of service link */
  termsOfServiceUrl?: string;
}

/** Options accepted by a single notification toast */
export interface AccountToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

/** Messages a promise toast renders across its loading/success/error phases */
export interface AccountToastPromiseMessages {
  loading?: AccountToastOptions;
  success?: AccountToastOptions | ((data: unknown) => AccountToastOptions);
  error?: (error: unknown) => AccountToastOptions;
}

/**
 * Notification surface the console calls for feedback. Intentionally minimal so
 * a host can adapt its own toaster to it; the concrete instance is injected.
 */
export interface AccountToaster {
  success: (options: AccountToastOptions) => unknown;
  error: (options: AccountToastOptions) => unknown;
  info: (options: AccountToastOptions) => unknown;
  warning: (options: AccountToastOptions) => unknown;
  promise: (
    task: () => Promise<unknown>,
    messages: AccountToastPromiseMessages,
  ) => unknown;
}

/** Shape returned by the account auth-client operations the console reads */
export interface AccountAuthResult {
  error?: { message: string } | null;
  data?: unknown;
}

/**
 * The user fields the account console reads: the standard identity fields every
 * auth system exposes, plus the optional capability fields the console surfaces
 * when a host enables them (username, role, two-factor, avatar).
 */
export interface AccountUser {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean | null;
  image?: string | null;
  username?: string | null;
  role?: string | null;
  twoFactorEnabled?: boolean | null;
}

/** The session fields the console reads */
export interface AccountSession {
  id: string;
  token: string;
  impersonatedBy?: string | null;
}

/** Combined session payload returned by the client's session hook */
export interface AccountSessionData {
  user: AccountUser;
  session: AccountSession;
}

/**
 * A session shown in the active-sessions list. The host pre-parses the user
 * agent into a coarse device type and a human label so the block stays a pure
 * presentation surface and thornberry takes on no UA-parsing dependency.
 */
export interface AccountActiveSession {
  id: string;
  token: string;
  /** Coarse device class used to pick an icon, e.g. "mobile" or "desktop" */
  deviceType?: string | null;
  /** Human-readable device/OS/browser label, e.g. "macOS (Chrome)" */
  label?: string | null;
}

/** A registered passkey the console lists */
export interface AccountPasskey {
  id: string;
  name?: string | null;
}

/** An organization the console reads for the current user */
export interface AccountOrganization {
  id: string;
  slug: string;
  name: string;
  type?: string | null;
}

/** A team within an organization */
export interface AccountTeam {
  id: string;
  name: string;
}

/**
 * Per-request lifecycle callbacks the console passes to client operations.
 * Callback payloads are intentionally loose (`any`): each auth backend shapes
 * them differently, and the console reads only `error.message` or `data` off
 * them, so a precise type here would only reject otherwise-valid hosts.
 */
export interface AccountFetchOptions {
  // biome-ignore lint/suspicious/noExplicitAny: backend-specific callback payloads
  onRequest?: (context?: any) => void;
  // biome-ignore lint/suspicious/noExplicitAny: backend-specific callback payloads
  onSuccess?: (context?: any) => void;
  // biome-ignore lint/suspicious/noExplicitAny: backend-specific callback payloads
  onError?: (context: any) => void;
}

/**
 * The subset of an auth client the account console drives. It is a structural
 * contract rather than a dependency on any auth library, so thornberry stays
 * auth-library-agnostic and a general consumer never has to install an auth
 * package to use the rest of thornberry. A host passes its own configured
 * client, casting at the injection boundary if its richer type does not match.
 */
export interface AccountAuthClient {
  useSession: () => {
    data: AccountSessionData | null;
    isPending: boolean;
    refetch: () => Promise<unknown>;
  };
  useListPasskeys: () => {
    data: AccountPasskey[] | null | undefined;
    isPending: boolean;
  };
  changePassword: (options: {
    newPassword: string;
    currentPassword: string;
  }) => Promise<AccountAuthResult>;
  updateUser: (options: {
    name?: string;
    username?: string;
    image?: string;
  }) => Promise<AccountAuthResult>;
  changeEmail: (options: {
    newEmail: string;
    callbackURL?: string;
  }) => Promise<AccountAuthResult>;
  revokeSession: (options: { token: string }) => Promise<AccountAuthResult>;
  passkey: {
    addPasskey: (options: {
      name?: string;
    }) => Promise<AccountAuthResult | undefined | null>;
    deletePasskey: (options: {
      id: string;
      fetchOptions?: AccountFetchOptions;
    }) => Promise<unknown>;
  };
  twoFactor: {
    getTotpUri: (
      options: { password: string },
      fetchOptions?: AccountFetchOptions,
    ) => Promise<unknown>;
    enable: (options: {
      password: string;
      fetchOptions?: AccountFetchOptions;
    }) => Promise<unknown>;
    disable: (options: {
      password: string;
      fetchOptions?: AccountFetchOptions;
    }) => Promise<unknown>;
    verifyTotp: (options: {
      code: string;
      fetchOptions?: AccountFetchOptions;
    }) => Promise<unknown>;
  };
  organization: {
    list: () => Promise<{ data?: AccountOrganization[] | null }>;
    listUserTeams: (options: { query: { organizationId: string } }) => Promise<{
      data?: AccountTeam[] | null;
      error?: { message?: string | null } | null;
    }>;
  };
  admin: {
    stopImpersonating: () => Promise<unknown>;
  };
}

/**
 * Everything the account console needs from its host, injected once at the top
 * so the individual blocks stay free of app singletons. This is the seam that
 * lets the same components render inside an identity server's own dashboard and
 * inside a relying-party account app.
 */
export interface AccountContextValue {
  /** Configured auth client the blocks call for every account operation */
  authClient: AccountAuthClient;
  /** Notification surface for success/error/promise toasts */
  toaster: AccountToaster;
  /** Host branding and copy */
  brand: AccountBrand;
}

const AccountContext = createContext<AccountContextValue | null>(null);

interface AccountProviderProps extends AccountContextValue {
  children: ReactNode;
}

/**
 * Provide the account console its host dependencies (auth client, toaster,
 * branding). Wrap the account surface once, near its root.
 */
const AccountProvider = ({ children, ...value }: AccountProviderProps) => (
  <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
);

/**
 * Read the injected account context. Throws if used outside an `AccountProvider`
 * so a missing wrapper fails loudly instead of silently rendering broken blocks.
 */
const useAccountContext = () => {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error("useAccountContext must be used within an AccountProvider");
  }

  return context;
};

export { AccountProvider, useAccountContext };
