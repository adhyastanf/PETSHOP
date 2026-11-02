import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { ComponentProps } from 'react';
import type { Select as SelectPrimitive } from '@base-ui/react/select';

type SelectOption<TValue> = {
  label: string;
  value: TValue;
};

type FormSelectProps<TValue> = {
  items: SelectOption<TValue>[];
  value?: TValue;
  onValueChange?: SelectPrimitive.Root.Props<TValue, false>['onValueChange'];
  isLoading?: boolean;
  placeholder?: string;
  invalid?: boolean;
} & Omit<ComponentProps<typeof SelectTrigger>, 'children'>;

export default function FormSelect<TValue>({ items, value, onValueChange, isLoading = false, placeholder = 'Select an option', invalid, disabled, ...props }: FormSelectProps<TValue>) {
  return (
    <Select<TValue> value={value} onValueChange={onValueChange} disabled={disabled} items={items}>
      <SelectTrigger {...props} disabled={disabled} aria-invalid={invalid}>
        <div className='flex items-center gap-2'>
          {isLoading && <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />}
          <SelectValue placeholder={isLoading ? 'Loading...' : placeholder} />
        </div>
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {isLoading ? (
            <div className='flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Loading...
            </div>
          ) : items.length === 0 ? (
            <div className='flex items-center justify-center p-4 text-sm text-muted-foreground'>Tidak ada data</div>
          ) : (
            items.map((item) => (
              <SelectItem key={String(item.value)} value={item.value}>
                {item.label}
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
