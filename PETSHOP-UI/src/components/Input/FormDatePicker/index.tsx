import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import type { ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';

type FormDatePickerProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = {
  field: ControllerRenderProps<TFieldValues, TName>;
  placeholder?: string;
  invalid?: boolean;
} & Omit<ComponentProps<typeof PopoverTrigger>, 'children'>;

export function FormDatePicker<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({ field, placeholder = 'Pilih tanggal', invalid = false, ...props }: FormDatePickerProps<TFieldValues, TName>) {
  const value = field.value as Date | undefined;

  return (
    <Popover>
      <PopoverTrigger
        {...props}
        aria-invalid={invalid}
        render={
          <Button variant='outline' className='flex justify-between'>
            {value ? format(value, 'dd/MM/yyyy') : <span>{placeholder}</span>}
            <CalendarIcon className='h-4 w-4 opacity-50' />
          </Button>
        }
      ></PopoverTrigger>

      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar mode='single' selected={value} onSelect={field.onChange} captionLayout='dropdown' startMonth={new Date(1900, 0)} endMonth={new Date()} />
      </PopoverContent>
    </Popover>
  );
}
