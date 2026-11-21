'use client';

import FormSelect from '@/components/Input/FormSelect';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from 'next-intl';
import { useId, type ComponentProps } from 'react';
import { Controller, type Control, type FieldError as RhfFieldError, type FieldValues, type Path } from 'react-hook-form';

/**
 * Renders a react-hook-form error. Zod messages in `lib/schema` are translation keys,
 * so they are translated here.
 */
export function FormFieldError({ error }: { error?: RhfFieldError }) {
  const t = useTranslations();
  if (!error) return null;
  return <FieldError errors={[{ message: error.message ? t(error.message) : t('common.validation.required') }]} />;
}

type BaseFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  /** Appends " *" to the visible label. Validation itself is defined in the Zod schema. */
  required?: boolean;
  /** Hides the visible label and exposes it as `aria-label` instead (the surrounding UI already shows the text). */
  hideLabel?: boolean;
  disabled?: boolean;
  className?: string;
};

function FieldLabelText({ htmlFor, label, required, hidden }: { htmlFor: string; label: string; required?: boolean; hidden?: boolean }) {
  if (hidden) return null;
  return <FieldLabel htmlFor={htmlFor}>{required ? `${label} *` : label}</FieldLabel>;
}

type TextFieldProps<T extends FieldValues> = BaseFieldProps<T> & Pick<ComponentProps<typeof Input>, 'type' | 'placeholder' | 'min' | 'step' | 'inputMode' | 'pattern'>;

export function FormTextField<T extends FieldValues>({ control, name, label, required, hideLabel, disabled, className, ...inputProps }: TextFieldProps<T>) {
  const id = useId();
  const inputId = `${id}-${name}`;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <FieldLabelText htmlFor={inputId} label={label} required={required} hidden={hideLabel} />
          <Input {...inputProps} {...field} value={(field.value as string | undefined) ?? ''} id={inputId} disabled={disabled} aria-label={hideLabel ? label : undefined} aria-invalid={fieldState.invalid} />
          <FormFieldError error={fieldState.error} />
        </Field>
      )}
    />
  );
}

type TextareaFieldProps<T extends FieldValues> = BaseFieldProps<T> & Pick<ComponentProps<typeof Textarea>, 'placeholder' | 'rows'>;

export function FormTextareaField<T extends FieldValues>({ control, name, label, required, hideLabel, disabled, className, ...textareaProps }: TextareaFieldProps<T>) {
  const id = useId();
  const inputId = `${id}-${name}`;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <FieldLabelText htmlFor={inputId} label={label} required={required} hidden={hideLabel} />
          <Textarea {...textareaProps} {...field} value={(field.value as string | undefined) ?? ''} id={inputId} disabled={disabled} aria-label={hideLabel ? label : undefined} aria-invalid={fieldState.invalid} />
          <FormFieldError error={fieldState.error} />
        </Field>
      )}
    />
  );
}

type SelectFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  items: { label: string; value: string }[];
  placeholder?: string;
};

export function FormSelectField<T extends FieldValues>({ control, name, label, required, hideLabel, disabled, className, items, placeholder }: SelectFieldProps<T>) {
  const id = useId();
  const inputId = `${id}-${name}`;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <FieldLabelText htmlFor={inputId} label={label} required={required} hidden={hideLabel} />
          <FormSelect<string>
            id={inputId}
            aria-label={hideLabel ? label : undefined}
            value={(field.value as string | undefined) ?? ''}
            onValueChange={(value) => field.onChange(value ?? '')}
            items={items}
            placeholder={placeholder}
            invalid={fieldState.invalid}
            disabled={disabled}
          />
          <FormFieldError error={fieldState.error} />
        </Field>
      )}
    />
  );
}
