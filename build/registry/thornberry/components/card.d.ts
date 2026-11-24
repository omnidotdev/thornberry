import { ark } from "@ark-ui/react";
import type { ComponentProps, ReactNode } from "react";
declare const CardRoot: ({ className, ...rest }: ComponentProps<typeof ark.div>) => import("react/jsx-runtime").JSX.Element;
declare const CardHeader: ({ className, ...rest }: ComponentProps<typeof ark.div>) => import("react/jsx-runtime").JSX.Element;
declare const CardTitle: ({ className, ...rest }: ComponentProps<typeof ark.div>) => import("react/jsx-runtime").JSX.Element;
declare const CardDescription: ({ className, ...rest }: ComponentProps<typeof ark.div>) => import("react/jsx-runtime").JSX.Element;
declare const CardContent: ({ className, ...rest }: ComponentProps<typeof ark.div>) => import("react/jsx-runtime").JSX.Element;
declare const CardFooter: ({ className, ...rest }: ComponentProps<typeof ark.div>) => import("react/jsx-runtime").JSX.Element;
interface CardProps extends Omit<ComponentProps<typeof CardRoot>, "title"> {
    /** Heading, rendered in a `CardHeader` with the description. */
    title?: ReactNode;
    description?: ReactNode;
    /** Footer content, rendered in a `CardFooter` when set. */
    footer?: ReactNode;
    headerProps?: ComponentProps<typeof CardHeader>;
    titleProps?: ComponentProps<typeof CardTitle>;
    descriptionProps?: ComponentProps<typeof CardDescription>;
    contentProps?: ComponentProps<typeof CardContent>;
    footerProps?: ComponentProps<typeof CardFooter>;
}
/**
 * Card with the standard header, content, and footer layout. Pass `title`,
 * `description`, and `footer`; `children` fill the content. Compose `CardRoot`
 * and its parts directly for any other layout.
 */
declare const Card: ({ title, description, footer, headerProps, titleProps, descriptionProps, contentProps, footerProps, children, ...rest }: CardProps) => import("react/jsx-runtime").JSX.Element;
export { Card, CardContent, CardDescription, CardFooter, CardHeader, type CardProps, CardRoot, CardTitle, };
