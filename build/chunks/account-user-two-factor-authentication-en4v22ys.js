// src/registry/thornberry/components/account-provider.tsx
import { createContext, useContext } from "react";
import { jsx } from "react/jsx-runtime";
var AccountContext = createContext(null);
var AccountProvider = ({ children, ...value }) => /* @__PURE__ */ jsx(AccountContext.Provider, {
  value,
  children
});
var useAccountContext = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccountContext must be used within an AccountProvider");
  }
  return context;
};
export { AccountProvider, useAccountContext };
