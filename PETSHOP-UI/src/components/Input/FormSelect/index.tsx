'use client';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Empty, EmptyDescription, EmptyHeader } from '@/components/ui/empty';
import { Loader2 } from 'lucide-react';
import type { ComponentProps } from 'react';
import type { Select as SelectPrimitive } from '@base-ui/react/select';
import { useTranslations } from 'next-intl';

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

export default function FormSelect<TValue>({ items, value, onValueChange, isLoading = false, placeholder, invalid, disabled, ...props }: FormSelectProps<TValue>) {
  const t = useTranslations('common');
  return (
    <Select<TValue> value={value} onValueChange={onValueChange} disabled={disabled} items={items}>
      <SelectTrigger {...props} disabled={disabled} aria-invalid={invalid}>
        <div className='flex items-center gap-2'>
          {isLoading && <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />}
          <SelectValue placeholder={isLoading ? t('loading') : placeholder ?? t('selectPlaceholder')} />
        </div>
      </SelectTrigger>

      <SelectContent>
        {isLoading ? (
          <div className='flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground' role='status'>
              <Loader2 className='h-4 w-4 animate-spin' />
              {t('loading')}
          </div>
        ) : items.length === 0 ? (
          <Empty className='gap-0 rounded-none border-0 px-4 py-3'>
            <EmptyHeader>
              <EmptyDescription>{t('noOptions')}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={String(item.value)} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
}
