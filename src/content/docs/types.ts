import type { ComponentProps } from "react";
import type { AccordionRoot } from "@/registry/thornberry/components/accordion";
import type { AlertRoot } from "@/registry/thornberry/components/alert";
import type { AngleSliderRoot } from "@/registry/thornberry/components/angle-slider";
import type { AvatarRoot } from "@/registry/thornberry/components/avatar";
import type { Badge } from "@/registry/thornberry/components/badge";
import type { Button } from "@/registry/thornberry/components/button";
import type { CardRoot } from "@/registry/thornberry/components/card";
import type { CarouselRoot } from "@/registry/thornberry/components/carousel";
import type { CheckboxRoot } from "@/registry/thornberry/components/checkbox";
import type { CollapsibleRoot } from "@/registry/thornberry/components/collapsible";
import type { ComboboxRoot } from "@/registry/thornberry/components/combobox";
import type { DatePickerRoot } from "@/registry/thornberry/components/date-picker";
import type { DialogRoot } from "@/registry/thornberry/components/dialog";
import type { FileUpload } from "@/registry/thornberry/components/file-upload";
import type { HoverCardRoot } from "@/registry/thornberry/components/hover-card";
import type { Input } from "@/registry/thornberry/components/input";
import type { MenuRoot } from "@/registry/thornberry/components/menu";
import type { NumberInputRoot } from "@/registry/thornberry/components/number-input";
import type { PaginationRoot } from "@/registry/thornberry/components/pagination";
import type { PinInputRoot } from "@/registry/thornberry/components/pin-input";
import type { PopoverRoot } from "@/registry/thornberry/components/popover";
import type { RatingGroupRoot } from "@/registry/thornberry/components/rating-group";
import type { SelectRoot } from "@/registry/thornberry/components/select";
import type { SliderRoot } from "@/registry/thornberry/components/slider";
import type { SwitchRoot } from "@/registry/thornberry/components/switch";
import type { TabsRoot } from "@/registry/thornberry/components/tabs";
import type { TagsInputRoot } from "@/registry/thornberry/components/tags-input";
import type { TooltipRoot } from "@/registry/thornberry/components/tooltip";
import type { FieldRoot } from "@/registry/thornberry/components/field";
import type { FieldsetRoot } from "@/registry/thornberry/components/fieldset";
import type { PasswordInputRoot } from "@/registry/thornberry/components/password-input";
import type { EditableRoot } from "@/registry/thornberry/components/editable";
import type { ClipboardRoot } from "@/registry/thornberry/components/clipboard";
import type { DownloadTrigger } from "@/registry/thornberry/components/download-trigger";
import type { ToggleRoot } from "@/registry/thornberry/components/toggle";
import type { ToggleGroupRoot } from "@/registry/thornberry/components/toggle-group";
import type { ProgressRoot } from "@/registry/thornberry/components/progress";
import type { StepsRoot } from "@/registry/thornberry/components/steps";
import type { SegmentGroupRoot } from "@/registry/thornberry/components/segment-group";
import type { Highlight } from "@/registry/thornberry/components/highlight";
import type { ScrollAreaRoot } from "@/registry/thornberry/components/scroll-area";
import type { BottomSheetRoot } from "@/registry/thornberry/components/bottom-sheet";
import type { SplitterRoot } from "@/registry/thornberry/components/splitter";
import type { FloatingPanelRoot } from "@/registry/thornberry/components/floating-panel";
import type { QrCodeRoot } from "@/registry/thornberry/components/qr-code";
import type { SignaturePadRoot } from "@/registry/thornberry/components/signature-pad";
import type { TreeViewRoot } from "@/registry/thornberry/components/tree-view";
import type { JsonTreeViewRoot } from "@/registry/thornberry/components/json-tree-view";
import type { MarqueeRoot } from "@/registry/thornberry/components/marquee";
import type { ToastRoot } from "@/registry/thornberry/components/toast";
import type { ListboxRoot } from "@/registry/thornberry/components/listbox";

export type AccordionProps = Omit<
  ComponentProps<typeof AccordionRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export interface AlertProps
  extends Omit<ComponentProps<typeof AlertRoot>, keyof ComponentProps<"div">> {
  title: string;
}

export type AngleSliderProps = Omit<
  ComponentProps<typeof AngleSliderRoot>,
  keyof ComponentProps<"div">
>;

export type AvatarProps = Omit<
  ComponentProps<typeof AvatarRoot>,
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
  extends Omit<ComponentProps<typeof CardRoot>, keyof ComponentProps<"div">> {
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

export type FileUploadProps = Omit<
  ComponentProps<typeof FileUpload>,
  keyof ComponentProps<"div"> | "ids"
>;

export type SelectProps = Omit<
  ComponentProps<typeof SelectRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type FieldProps = Omit<
  ComponentProps<typeof FieldRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type FieldsetProps = Omit<
  ComponentProps<typeof FieldsetRoot>,
  keyof ComponentProps<"fieldset">
>;

export type PasswordInputProps = Omit<
  ComponentProps<typeof PasswordInputRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type EditableProps = Omit<
  ComponentProps<typeof EditableRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type ClipboardProps = Omit<
  ComponentProps<typeof ClipboardRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type DownloadTriggerProps = Omit<
  ComponentProps<typeof DownloadTrigger>,
  keyof ComponentProps<"button">
>;

export type ToggleProps = Omit<
  ComponentProps<typeof ToggleRoot>,
  keyof ComponentProps<"button">
>;

export type ToggleGroupProps = Omit<
  ComponentProps<typeof ToggleGroupRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type ProgressProps = Omit<
  ComponentProps<typeof ProgressRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type StepsProps = Omit<
  ComponentProps<typeof StepsRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type SegmentGroupProps = Omit<
  ComponentProps<typeof SegmentGroupRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type HighlightProps = Omit<
  ComponentProps<typeof Highlight>,
  keyof ComponentProps<"div">
>;

export type ScrollAreaProps = Omit<
  ComponentProps<typeof ScrollAreaRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type BottomSheetProps = Omit<
  ComponentProps<typeof BottomSheetRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type SplitterProps = Omit<
  ComponentProps<typeof SplitterRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type FloatingPanelProps = Omit<
  ComponentProps<typeof FloatingPanelRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type QrCodeProps = Omit<
  ComponentProps<typeof QrCodeRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type SignaturePadProps = Omit<
  ComponentProps<typeof SignaturePadRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type TreeViewProps = Omit<
  ComponentProps<typeof TreeViewRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type JsonTreeViewProps = Omit<
  ComponentProps<typeof JsonTreeViewRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type MarqueeProps = Omit<
  ComponentProps<typeof MarqueeRoot>,
  keyof ComponentProps<"div"> | "ids"
>;

export type ToastProps = Omit<
  ComponentProps<typeof ToastRoot>,
  keyof ComponentProps<"div">
>;

export type ListboxProps = Omit<
  ComponentProps<typeof ListboxRoot>,
  keyof ComponentProps<"div"> | "ids"
>;
