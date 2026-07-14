'use client';

import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Minus, Plus } from 'lucide-react';
import { ChangeEvent, ComponentProps } from 'react';

export default function QuantityInput({ value = 1, onValueChange = () => {}, min = 0, max = Number.MAX_SAFE_INTEGER, disabled = false, ...props }: QuantityInputProps) {
  const disabledMinus = disabled || value <= min;
  const disabledPlus = disabled || value >= max;

  function handleIncrement() {
    if (!disabledPlus) onValueChange(value + 1);
  }

  function handleDecrement() {
    if (!disabledMinus) onValueChange(value - 1);
  }

  function handleChangeInput(e: ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    if (Number.isNaN(val)) return;
    onValueChange(Math.min(max, Math.max(min, val)));
  }

  return (
    <InputGroup className='py-5'>
      <InputGroupAddon align='inline-start'>
        <Button variant='ghost' size='icon' disabled={disabledMinus} onClick={handleDecrement}>
          <Minus />
        </Button>
      </InputGroupAddon>

      <InputGroupInput value={value} className='text-center' onChange={handleChangeInput} {...props} />
      <InputGroupAddon align='inline-end'>
        <Button variant='ghost' size='icon' disabled={disabledPlus} onClick={handleIncrement}>
          <Plus />
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
}

type QuantityInputProps = Omit<ComponentProps<typeof InputGroupInput>, 'value' | 'onChange'> & {
  onValueChange?: (value: number) => void;
  value?: number;
  min?: number;
  max?: number;
};
