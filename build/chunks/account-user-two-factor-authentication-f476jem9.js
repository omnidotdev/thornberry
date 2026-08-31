import {
  useAccountContext
} from "./account-user-two-factor-authentication-en4v22ys.js";
import {
  Button
} from "./account-user-two-factor-authentication-jb3sh07m.js";

// src/registry/thornberry/components/account-user-active-sessions.tsx
import { Loader2, Monitor, Smartphone } from "lucide-react";
import { useState } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var UserActiveSessions = ({
  activeSessions,
  onSessionRevoked
}) => {
  const { authClient, toaster } = useAccountContext();
  const { data: session } = authClient.useSession();
  const [isTerminating, setIsTerminating] = useState();
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsx("h3", {
        className: "font-bold text-xl",
        children: "Active Sessions"
      }),
      activeSessions.map((activeSession) => /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-2",
        children: [
          activeSession.deviceType === "mobile" ? /* @__PURE__ */ jsx(Smartphone, {
            className: "size-4"
          }) : /* @__PURE__ */ jsx(Monitor, {
            className: "size-4"
          }),
          activeSession.label ?? "Unknown device",
          /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            className: "text-red-500 underline hover:text-red-600",
            onClick: async () => {
              setIsTerminating(activeSession.id);
              const res = await authClient.revokeSession({
                token: activeSession.token
              });
              if (res.error) {
                toaster.error({
                  title: res.error.message ?? "Failed to revoke session"
                });
              } else {
                toaster.success({ title: "Session terminated successfully" });
              }
              onSessionRevoked?.();
              setIsTerminating(undefined);
            },
            children: isTerminating === activeSession.id ? /* @__PURE__ */ jsx(Loader2, {
              className: "size-4 animate-spin"
            }) : activeSession.id === session?.session.id ? "Sign Out" : "Terminate"
          })
        ]
      }, activeSession.id))
    ]
  });
};
export { UserActiveSessions };
