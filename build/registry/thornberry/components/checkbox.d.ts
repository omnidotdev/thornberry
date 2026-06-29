import { Checkbox as ArkCheckbox } from "@ark-ui/react/checkbox";
import type { ComponentProps, ReactNode } from "react";
declare const CheckboxProvider: import("react").ForwardRefExoticComponent<ArkCheckbox.RootProviderProps & import("react").RefAttributes<HTMLLabelElement>>;
declare const CheckboxGroup: import("react").ForwardRefExoticComponent<ArkCheckbox.GroupProps & import("react").RefAttributes<HTMLDivElement>>;
declare const CheckboxContext: (props: ArkCheckbox.ContextProps) => ReactNode;
declare const CheckboxRoot: ({ className, ...rest }: ComponentProps<typeof ArkCheckbox.Root>) => import("react/jsx-runtime").JSX.Element;
declare const CheckboxLabel: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
declare const CheckboxControl: ({ className, ...rest }: ComponentProps<typeof ArkCheckbox.Control>) => import("react/jsx-runtime").JSX.Element;
declare const CheckboxIndicator: ({ className, ...rest }: ComponentProps<typeof ArkCheckbox.Indicator>) => import("react/jsx-runtime").JSX.Element;
declare const CheckboxHiddenInput: ({ className, ...rest }: ComponentProps<typeof ArkCheckbox.HiddenInput>) => import("react/jsx-runtime").JSX.Element;
export { CheckboxProvider, CheckboxGroup, CheckboxContext, CheckboxRoot, CheckboxLabel, CheckboxControl, CheckboxIndicator, CheckboxHiddenInput, };
