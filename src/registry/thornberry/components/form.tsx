import { ark } from "@ark-ui/react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Check, ChevronDown } from "lucide-react";
import { useMemo } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/thornberry/components/button";
import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
} from "@/registry/thornberry/components/checkbox";
import { Input } from "@/registry/thornberry/components/input";
import { PasswordInput } from "@/registry/thornberry/components/password-input";
import {
  Select,
  SelectContent,
  SelectControl,
  SelectHiddenSelect,
  SelectIndicator,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPositioner,
  SelectTrigger,
  SelectValueText,
  createListCollection,
} from "@/registry/thornberry/components/select";

import type { ComponentProps, ReactNode } from "react";

/**
 * TanStack Form wrapper for thornberry.
 *
 * Uses the TanStack Form composition API (`createFormHook`) to pre-bind a set
 * of field components onto thornberry's own inputs, so consumers get typed,
 * validation-aware fields with matching styling out of the box.
 *
 * @example
 * const form = useAppForm({
 *   defaultValues: { name: "", role: "coach", active: true, bio: "" },
 *   onSubmit: async ({ value }) => save(value),
 * });
 *
 * <form
 *   onSubmit={(e) => {
 *     e.preventDefault();
 *     form.handleSubmit();
 *   }}
 * >
 *   <form.AppField name="name">
 *     {(field) => <field.TextField label="Name" />}
 *   </form.AppField>
 *   <form.AppField name="role">
 *     {(field) => (
 *       <field.SelectField
 *         label="Role"
 *         items={[
 *           { label: "Coach", value: "coach" },
 *           { label: "Admin", value: "admin" },
 *         ]}
 *       />
 *     )}
 *   </form.AppField>
 *   <form.AppField name="active">
 *     {(field) => <field.CheckboxField label="Active" />}
 *   </form.AppField>
 *   <form.AppField name="bio">
 *     {(field) => <field.TextareaField label="Bio" />}
 *   </form.AppField>
 *   <form.AppForm>
 *     <form.SubmitButton label="Save" />
 *   </form.AppForm>
 * </form>;
 */
const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

/**
 * Normalize the heterogeneous TanStack error array (strings from function
 * validators, `{ message }` objects from standard-schema validators) into a
 * flat list of human-readable strings.
 */
const errorMessages = (errors: unknown[]): string[] =>
  errors
    .map((error) =>
      typeof error === "string"
        ? error
        : ((error as { message?: string } | null)?.message ?? ""),
    )
    .filter(Boolean);

const FieldErrors = ({ errors }: { errors: unknown[] }) => {
  const messages = errorMessages(errors);

  if (!messages.length) return null;

  return (
    <p className="font-medium text-destructive text-xs">
      {messages.join(", ")}
    </p>
  );
};

const FieldLabel = ({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: ReactNode;
}) => (
  <label
    htmlFor={htmlFor}
    className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    {children}
  </label>
);

interface TextFieldProps
  extends Omit<
    ComponentProps<typeof Input>,
    "value" | "onChange" | "onBlur" | "name"
  > {
  label?: string;
}

const TextField = ({ label, className, id, ...rest }: TextFieldProps) => {
  const field = useFieldContext<string>();
  const fieldId = id ?? field.name;
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}
      <Input
        id={fieldId}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={hasError || undefined}
        className={cn(
          hasError && "border-destructive focus-visible:ring-destructive",
          className,
        )}
        {...rest}
      />
      {hasError && <FieldErrors errors={field.state.meta.errors} />}
    </div>
  );
};

interface PasswordFieldProps
  extends Omit<
    ComponentProps<typeof PasswordInput>,
    "value" | "onChange" | "onBlur" | "name"
  > {
  label?: string;
}

const PasswordField = ({
  label,
  className,
  id,
  ...rest
}: PasswordFieldProps) => {
  const field = useFieldContext<string>();
  const fieldId = id ?? field.name;
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}
      <PasswordInput
        id={fieldId}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={hasError || undefined}
        className={cn(
          hasError && "border-destructive focus-visible:ring-destructive",
          className,
        )}
        {...rest}
      />
      {hasError && <FieldErrors errors={field.state.meta.errors} />}
    </div>
  );
};

interface TextareaFieldProps
  extends Omit<
    ComponentProps<typeof ark.textarea>,
    "value" | "onChange" | "onBlur" | "name"
  > {
  label?: string;
}

const TextareaField = ({
  label,
  className,
  id,
  ...rest
}: TextareaFieldProps) => {
  const field = useFieldContext<string>();
  const fieldId = id ?? field.name;
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}
      <ark.textarea
        id={fieldId}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={hasError || undefined}
        className={cn(
          "flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
          hasError && "border-destructive focus-visible:ring-destructive",
          className,
        )}
        {...rest}
      />
      {hasError && <FieldErrors errors={field.state.meta.errors} />}
    </div>
  );
};

interface CheckboxFieldProps {
  label?: string;
}

const CheckboxField = ({ label }: CheckboxFieldProps) => {
  const field = useFieldContext<boolean>();
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <div className="flex flex-col gap-1.5">
      <CheckboxRoot
        checked={field.state.value ?? false}
        onCheckedChange={(details) =>
          field.handleChange(details.checked === true)
        }
      >
        <CheckboxControl>
          <CheckboxIndicator>
            <Check className="size-3.5" />
          </CheckboxIndicator>
        </CheckboxControl>
        {label && <CheckboxLabel>{label}</CheckboxLabel>}
        <CheckboxHiddenInput />
      </CheckboxRoot>
      {hasError && <FieldErrors errors={field.state.meta.errors} />}
    </div>
  );
};

interface SelectFieldItem {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label?: string;
  items: SelectFieldItem[];
  placeholder?: string;
}

const SelectField = ({ label, items, placeholder }: SelectFieldProps) => {
  const field = useFieldContext<string>();
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const collection = useMemo(() => createListCollection({ items }), [items]);

  return (
    <div className="flex w-full flex-col gap-1.5">
      <Select
        collection={collection}
        value={field.state.value ? [field.state.value] : []}
        onValueChange={(details) => field.handleChange(details.value[0] ?? "")}
        onInteractOutside={() => field.handleBlur()}
      >
        {label && (
          <SelectLabel className="text-foreground">{label}</SelectLabel>
        )}
        <SelectControl>
          <SelectTrigger
            className={cn(
              "w-full border border-input bg-transparent",
              hasError && "border-destructive",
            )}
          >
            <SelectValueText placeholder={placeholder ?? "Select an option"} />
            <SelectIndicator>
              <ChevronDown className="size-4 opacity-50" />
            </SelectIndicator>
          </SelectTrigger>
        </SelectControl>
        <SelectPositioner>
          <SelectContent>
            {collection.items.map((item) => (
              <SelectItem key={item.value} item={item}>
                <SelectItemText>{item.label}</SelectItemText>
                <SelectItemIndicator />
              </SelectItem>
            ))}
          </SelectContent>
        </SelectPositioner>
        <SelectHiddenSelect />
      </Select>
      {hasError && <FieldErrors errors={field.state.meta.errors} />}
    </div>
  );
};

interface SubmitButtonProps
  extends Omit<ComponentProps<typeof Button>, "type"> {
  label: string;
}

const SubmitButton = ({ label, ...rest }: SubmitButtonProps) => {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        isSubmitting: state.isSubmitting,
      })}
    >
      {({ canSubmit, isSubmitting }) => (
        <Button type="submit" disabled={!canSubmit} {...rest}>
          {isSubmitting ? "Submitting..." : label}
        </Button>
      )}
    </form.Subscribe>
  );
};

const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    PasswordField,
    TextareaField,
    CheckboxField,
    SelectField,
  },
  formComponents: {
    SubmitButton,
  },
});

export {
  useAppForm,
  withForm,
  withFieldGroup,
  useFieldContext,
  useFormContext,
  fieldContext,
  formContext,
  TextField,
  PasswordField,
  TextareaField,
  CheckboxField,
  SelectField,
  SubmitButton,
  type TextFieldProps,
  type PasswordFieldProps,
  type TextareaFieldProps,
  type CheckboxFieldProps,
  type SelectFieldProps,
  type SelectFieldItem,
  type SubmitButtonProps,
};
