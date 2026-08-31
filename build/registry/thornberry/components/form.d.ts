import { ark } from "@ark-ui/react";
import { Button } from "../../../registry/thornberry/components/button";
import { Input } from "../../../registry/thornberry/components/input";
import { PasswordInput } from "../../../registry/thornberry/components/password-input";
import type { ComponentProps } from "react";
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
declare const fieldContext: import("react").Context<import("@tanstack/form-core").AnyFieldApi>, formContext: import("react").Context<import("@tanstack/form-core").AnyFormApi>, useFieldContext: <TData>() => import("@tanstack/form-core").FieldApi<any, string, TData, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>, useFormContext: () => import("@tanstack/react-form").ReactFormExtendedApi<Record<string, never>, any, any, any, any, any, any, any, any, any, any, any>;
interface TextFieldProps extends Omit<ComponentProps<typeof Input>, "value" | "onChange" | "onBlur" | "name"> {
    label?: string;
}
declare const TextField: ({ label, className, id, ...rest }: TextFieldProps) => import("react/jsx-runtime").JSX.Element;
interface PasswordFieldProps extends Omit<ComponentProps<typeof PasswordInput>, "value" | "onChange" | "onBlur" | "name"> {
    label?: string;
}
declare const PasswordField: ({ label, className, id, ...rest }: PasswordFieldProps) => import("react/jsx-runtime").JSX.Element;
interface TextareaFieldProps extends Omit<ComponentProps<typeof ark.textarea>, "value" | "onChange" | "onBlur" | "name"> {
    label?: string;
}
declare const TextareaField: ({ label, className, id, ...rest }: TextareaFieldProps) => import("react/jsx-runtime").JSX.Element;
interface CheckboxFieldProps {
    label?: string;
}
declare const CheckboxField: ({ label }: CheckboxFieldProps) => import("react/jsx-runtime").JSX.Element;
interface SelectFieldItem {
    label: string;
    value: string;
}
interface SelectFieldProps {
    label?: string;
    items: SelectFieldItem[];
    placeholder?: string;
}
declare const SelectField: ({ label, items, placeholder }: SelectFieldProps) => import("react/jsx-runtime").JSX.Element;
interface SubmitButtonProps extends Omit<ComponentProps<typeof Button>, "type"> {
    label: string;
}
declare const SubmitButton: ({ label, ...rest }: SubmitButtonProps) => import("react/jsx-runtime").JSX.Element;
declare const useAppForm: <TFormData, TOnMount extends import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined, TOnChange extends import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined, TOnChangeAsync extends import("@tanstack/form-core").FormAsyncValidateOrFn<TFormData> | undefined, TOnBlur extends import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined, TOnBlurAsync extends import("@tanstack/form-core").FormAsyncValidateOrFn<TFormData> | undefined, TOnSubmit extends import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined, TOnSubmitAsync extends import("@tanstack/form-core").FormAsyncValidateOrFn<TFormData> | undefined, TOnDynamic extends import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined, TOnDynamicAsync extends import("@tanstack/form-core").FormAsyncValidateOrFn<TFormData> | undefined, TOnServer extends import("@tanstack/form-core").FormAsyncValidateOrFn<TFormData> | undefined, TSubmitMeta>(props: import("@tanstack/form-core").FormOptions<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta>) => import("@tanstack/react-form").AppFieldExtendedReactFormApi<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta, {
    readonly TextField: ({ label, className, id, ...rest }: TextFieldProps) => import("react/jsx-runtime").JSX.Element;
    readonly PasswordField: ({ label, className, id, ...rest }: PasswordFieldProps) => import("react/jsx-runtime").JSX.Element;
    readonly TextareaField: ({ label, className, id, ...rest }: TextareaFieldProps) => import("react/jsx-runtime").JSX.Element;
    readonly CheckboxField: ({ label }: CheckboxFieldProps) => import("react/jsx-runtime").JSX.Element;
    readonly SelectField: ({ label, items, placeholder }: SelectFieldProps) => import("react/jsx-runtime").JSX.Element;
}, {
    readonly SubmitButton: ({ label, ...rest }: SubmitButtonProps) => import("react/jsx-runtime").JSX.Element;
}>, withForm: <TFormData, TOnMount extends import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined, TOnChange extends import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined, TOnChangeAsync extends import("@tanstack/form-core").FormAsyncValidateOrFn<TFormData> | undefined, TOnBlur extends import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined, TOnBlurAsync extends import("@tanstack/form-core").FormAsyncValidateOrFn<TFormData> | undefined, TOnSubmit extends import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined, TOnSubmitAsync extends import("@tanstack/form-core").FormAsyncValidateOrFn<TFormData> | undefined, TOnDynamic extends import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined, TOnDynamicAsync extends import("@tanstack/form-core").FormAsyncValidateOrFn<TFormData> | undefined, TOnServer extends import("@tanstack/form-core").FormAsyncValidateOrFn<TFormData> | undefined, TSubmitMeta, TRenderProps extends object = {}>({ render, props, }: import("@tanstack/react-form").WithFormProps<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta, {
    readonly TextField: ({ label, className, id, ...rest }: TextFieldProps) => import("react/jsx-runtime").JSX.Element;
    readonly PasswordField: ({ label, className, id, ...rest }: PasswordFieldProps) => import("react/jsx-runtime").JSX.Element;
    readonly TextareaField: ({ label, className, id, ...rest }: TextareaFieldProps) => import("react/jsx-runtime").JSX.Element;
    readonly CheckboxField: ({ label }: CheckboxFieldProps) => import("react/jsx-runtime").JSX.Element;
    readonly SelectField: ({ label, items, placeholder }: SelectFieldProps) => import("react/jsx-runtime").JSX.Element;
}, {
    readonly SubmitButton: ({ label, ...rest }: SubmitButtonProps) => import("react/jsx-runtime").JSX.Element;
}, TRenderProps>) => import("react").FunctionComponent<import("react").PropsWithChildren<NoInfer<[unknown] extends [TRenderProps] ? any : TRenderProps> & {
    form: import("@tanstack/react-form").AppFieldExtendedReactFormApi<[unknown] extends [TFormData] ? any : TFormData, [import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined] extends [TOnMount] ? [TOnMount] extends [TOnMount & (import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined)] ? any : TOnMount : TOnMount, [import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined] extends [TOnChange] ? [TOnChange] extends [TOnChange & (import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined)] ? any : TOnChange : TOnChange, [import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined] extends [TOnChangeAsync] ? [TOnChangeAsync] extends [TOnChangeAsync & (import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined)] ? any : TOnChangeAsync : TOnChangeAsync, [import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined] extends [TOnBlur] ? [TOnBlur] extends [TOnBlur & (import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined)] ? any : TOnBlur : TOnBlur, [import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined] extends [TOnBlurAsync] ? [TOnBlurAsync] extends [TOnBlurAsync & (import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined)] ? any : TOnBlurAsync : TOnBlurAsync, [import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined] extends [TOnSubmit] ? [TOnSubmit] extends [TOnSubmit & (import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined)] ? any : TOnSubmit : TOnSubmit, [import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined] extends [TOnSubmitAsync] ? [TOnSubmitAsync] extends [TOnSubmitAsync & (import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined)] ? any : TOnSubmitAsync : TOnSubmitAsync, [import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined] extends [TOnDynamic] ? [TOnDynamic] extends [TOnDynamic & (import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined)] ? any : TOnDynamic : TOnDynamic, [import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined] extends [TOnDynamicAsync] ? [TOnDynamicAsync] extends [TOnDynamicAsync & (import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined)] ? any : TOnDynamicAsync : TOnDynamicAsync, [import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined] extends [TOnServer] ? [TOnServer] extends [TOnServer & (import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined)] ? any : TOnServer : TOnServer, [unknown] extends [TSubmitMeta] ? any : TSubmitMeta, {
        readonly TextField: ({ label, className, id, ...rest }: TextFieldProps) => import("react/jsx-runtime").JSX.Element;
        readonly PasswordField: ({ label, className, id, ...rest }: PasswordFieldProps) => import("react/jsx-runtime").JSX.Element;
        readonly TextareaField: ({ label, className, id, ...rest }: TextareaFieldProps) => import("react/jsx-runtime").JSX.Element;
        readonly CheckboxField: ({ label }: CheckboxFieldProps) => import("react/jsx-runtime").JSX.Element;
        readonly SelectField: ({ label, items, placeholder }: SelectFieldProps) => import("react/jsx-runtime").JSX.Element;
    }, {
        readonly SubmitButton: ({ label, ...rest }: SubmitButtonProps) => import("react/jsx-runtime").JSX.Element;
    }>;
}>>, withFieldGroup: <TFieldGroupData, TSubmitMeta, TRenderProps extends object = {}>({ render, props, defaultValues, }: import("@tanstack/react-form").WithFieldGroupProps<TFieldGroupData, {
    readonly TextField: ({ label, className, id, ...rest }: TextFieldProps) => import("react/jsx-runtime").JSX.Element;
    readonly PasswordField: ({ label, className, id, ...rest }: PasswordFieldProps) => import("react/jsx-runtime").JSX.Element;
    readonly TextareaField: ({ label, className, id, ...rest }: TextareaFieldProps) => import("react/jsx-runtime").JSX.Element;
    readonly CheckboxField: ({ label }: CheckboxFieldProps) => import("react/jsx-runtime").JSX.Element;
    readonly SelectField: ({ label, items, placeholder }: SelectFieldProps) => import("react/jsx-runtime").JSX.Element;
}, {
    readonly SubmitButton: ({ label, ...rest }: SubmitButtonProps) => import("react/jsx-runtime").JSX.Element;
}, TSubmitMeta, TRenderProps>) => <TFormData, TFields extends import("@tanstack/form-core").DeepKeysOfType<TFormData, TFieldGroupData | null | undefined> | import("@tanstack/form-core").FieldsMap<TFormData, TFieldGroupData>, TOnMount extends import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined, TOnChange extends import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined, TOnChangeAsync extends import("@tanstack/form-core").FormAsyncValidateOrFn<TFormData> | undefined, TOnBlur extends import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined, TOnBlurAsync extends import("@tanstack/form-core").FormAsyncValidateOrFn<TFormData> | undefined, TOnSubmit extends import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined, TOnSubmitAsync extends import("@tanstack/form-core").FormAsyncValidateOrFn<TFormData> | undefined, TOnDynamic extends import("@tanstack/form-core").FormValidateOrFn<TFormData> | undefined, TOnDynamicAsync extends import("@tanstack/form-core").FormAsyncValidateOrFn<TFormData> | undefined, TOnServer extends import("@tanstack/form-core").FormAsyncValidateOrFn<TFormData> | undefined, TFormSubmitMeta>(params: import("react").PropsWithChildren<NoInfer<TRenderProps> & {
    form: import("@tanstack/react-form").AppFieldExtendedReactFormApi<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, unknown extends TSubmitMeta ? TFormSubmitMeta : TSubmitMeta, {
        readonly TextField: ({ label, className, id, ...rest }: TextFieldProps) => import("react/jsx-runtime").JSX.Element;
        readonly PasswordField: ({ label, className, id, ...rest }: PasswordFieldProps) => import("react/jsx-runtime").JSX.Element;
        readonly TextareaField: ({ label, className, id, ...rest }: TextareaFieldProps) => import("react/jsx-runtime").JSX.Element;
        readonly CheckboxField: ({ label }: CheckboxFieldProps) => import("react/jsx-runtime").JSX.Element;
        readonly SelectField: ({ label, items, placeholder }: SelectFieldProps) => import("react/jsx-runtime").JSX.Element;
    }, {
        readonly SubmitButton: ({ label, ...rest }: SubmitButtonProps) => import("react/jsx-runtime").JSX.Element;
    }> | import("@tanstack/react-form").AppFieldExtendedReactFieldGroupApi<unknown, TFormData, string | import("@tanstack/form-core").FieldsMap<unknown, TFormData>, any, any, any, any, any, any, any, any, any, any, unknown extends TSubmitMeta ? TFormSubmitMeta : TSubmitMeta, {
        readonly TextField: ({ label, className, id, ...rest }: TextFieldProps) => import("react/jsx-runtime").JSX.Element;
        readonly PasswordField: ({ label, className, id, ...rest }: PasswordFieldProps) => import("react/jsx-runtime").JSX.Element;
        readonly TextareaField: ({ label, className, id, ...rest }: TextareaFieldProps) => import("react/jsx-runtime").JSX.Element;
        readonly CheckboxField: ({ label }: CheckboxFieldProps) => import("react/jsx-runtime").JSX.Element;
        readonly SelectField: ({ label, items, placeholder }: SelectFieldProps) => import("react/jsx-runtime").JSX.Element;
    }, {
        readonly SubmitButton: ({ label, ...rest }: SubmitButtonProps) => import("react/jsx-runtime").JSX.Element;
    }>;
    fields: TFields;
}>) => ReturnType<import("react").FunctionComponent>;
export { useAppForm, withForm, withFieldGroup, useFieldContext, useFormContext, fieldContext, formContext, TextField, PasswordField, TextareaField, CheckboxField, SelectField, SubmitButton, type TextFieldProps, type PasswordFieldProps, type TextareaFieldProps, type CheckboxFieldProps, type SelectFieldProps, type SelectFieldItem, type SubmitButtonProps, };
