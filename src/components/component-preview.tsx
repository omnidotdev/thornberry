import type { PropsWithChildren } from "react";

interface ComponentPreviewProps extends PropsWithChildren {
  className?: string;
  /**
   * Alignment of the preview content
   * @default "center"
   */
  align?: "start" | "center" | "end";
  /**
   * Minimum height of the preview container
   * @default "200px"
   */
  minHeight?: string;
}

export const ComponentPreview = ({
  children,
  className = "",
  align = "center",
  minHeight = "200px",
}: ComponentPreviewProps) => {
  const alignmentClasses = {
    start: "items-start justify-start",
    center: "items-center justify-center",
    end: "items-end justify-end",
  };

  return (
    <div
      className={`not-prose my-8 flex w-full rounded-lg border bg-background p-8 ${alignmentClasses[align]} ${className}`}
      style={{ minHeight }}
    >
      {children}
    </div>
  );
};
