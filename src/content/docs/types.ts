import type { ComponentProps } from "react";
import type { AccordionRoot } from "@/registry/thornberry/components/accordion";
import type { AlertProps as RegistryAlertProps } from "@/registry/thornberry/components/alert";
import type { AngleSliderRoot } from "@/registry/thornberry/components/angle-slider";
import type { AvatarProps as RegistryAvatarProps } from "@/registry/thornberry/components/avatar";
import type { Badge } from "@/registry/thornberry/components/badge";
import type { Button } from "@/registry/thornberry/components/button";
import type { CardProps as RegistryCardProps } from "@/registry/thornberry/components/card";
import type { CarouselRoot } from "@/registry/thornberry/components/carousel";
import type { CheckboxRoot } from "@/registry/thornberry/components/checkbox";
import type { CollapsibleRoot } from "@/registry/thornberry/components/collapsible";
import type { ComboboxRoot } from "@/registry/thornberry/components/combobox";
import type { DatePickerRoot } from "@/registry/thornberry/components/date-picker";
import type { DialogRoot } from "@/registry/thornberry/components/dialog";
import type { HoverCardRoot } from "@/registry/thornberry/components/hover-card";
import type { Input } from "@/registry/thornberry/components/input";
import type { MenuRoot } from "@/registry/thornberry/components/menu";
import type { NumberInputRoot } from "@/registry/thornberry/components/number-input";
import type { PaginationRoot } from "@/registry/thornberry/components/pagination";
import type { PinInputRoot } from "@/registry/thornberry/components/pin-input";
import type { PopoverRoot } from "@/registry/thornberry/components/popover";
import type { RatingGroupRoot } from "@/registry/thornberry/components/rating-group";
import type { SliderRoot } from "@/registry/thornberry/components/slider";
import type { SwitchRoot } from "@/registry/thornberry/components/switch";
import type { TabsRoot } from "@/registry/thornberry/components/tabs";
import type { TagsInputRoot } from "@/registry/thornberry/components/tags-input";
import type { TooltipRoot } from "@/registry/thornberry/components/tooltip";

export type AccordionProps = Omit<
  ComponentProps<typeof AccordionRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export interface AlertProps
  extends Omit<RegistryAlertProps, keyof ComponentProps<"div">> {
  title: string;
}

export type AngleSliderProps = Omit<
  ComponentProps<typeof AngleSliderRoot>,
  keyof ComponentProps<"div">
>;

export type AvatarProps = Omit<
  RegistryAvatarProps,
  keyof ComponentProps<"div"> | "ids"
>;

export type BadgeProps = Omit<
  ComponentProps<typeof Badge>,
  keyof ComponentProps<"div">
>;

export type ButtonProps = Omit<
  ComponentProps<typeof Button>,
  keyof ComponentProps<"button">
>;

export interface CardProps
  extends Omit<RegistryCardProps, keyof ComponentProps<"div">> {
  title?: string;
}

export type CarouselProps = Omit<
  ComponentProps<typeof CarouselRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type CheckboxProps = Omit<
  ComponentProps<typeof CheckboxRoot>,
  keyof ComponentProps<"label"> | "ids"
>;

export type CollapsibleProps = Omit<
  ComponentProps<typeof CollapsibleRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type ComboboxProps = Omit<
  ComponentProps<typeof ComboboxRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type DatePickerProps = Omit<
  ComponentProps<typeof DatePickerRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type DialogProps = Omit<
  ComponentProps<typeof DialogRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type HoverCardProps = Omit<
  ComponentProps<typeof HoverCardRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type InputProps = Omit<
  ComponentProps<typeof Input>,
  keyof ComponentProps<"input">
>;

export type MenuProps = Omit<
  ComponentProps<typeof MenuRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type NumberInputProps = Omit<
  ComponentProps<typeof NumberInputRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type PaginationProps = Omit<
  ComponentProps<typeof PaginationRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type PinInputProps = Omit<
  ComponentProps<typeof PinInputRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type PopoverProps = Omit<
  ComponentProps<typeof PopoverRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type RatingGroupProps = Omit<
  ComponentProps<typeof RatingGroupRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type SheetProps = Omit<
  ComponentProps<typeof DialogRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type SliderProps = Omit<
  ComponentProps<typeof SliderRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type SwitchProps = Omit<
  ComponentProps<typeof SwitchRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type TabsProps = Omit<
  ComponentProps<typeof TabsRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type TooltipProps = Omit<
  ComponentProps<typeof TooltipRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type TagsInputProps = Omit<
  ComponentProps<typeof TagsInputRoot>,
  keyof ComponentProps<"div"> | "ids"
>;
