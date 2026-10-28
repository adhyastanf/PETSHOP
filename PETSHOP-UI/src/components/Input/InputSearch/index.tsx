'use client'

import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { useI18n } from "@/lib/i18n";

type InputProps = {
  icon ?: React.ReactNode;
  placeholder ?: string;
  className ?: string;
}

type InputSearchProps = ComponentProps<typeof InputGroupInput> & InputProps;

export default function InputSearch({
  icon = <Search className="size-4" />,
  className,
  placeholder,
  ...props
}: InputSearchProps) {
  const { t } = useI18n();

  return (
    <InputGroup className={cn("w-full", className)}>
      <InputGroupInput
        placeholder={placeholder ?? t('common.searchPlaceholder')}
        {...props}
      />

      <InputGroupAddon>
        {icon}
      </InputGroupAddon>
    </InputGroup>
  );
}