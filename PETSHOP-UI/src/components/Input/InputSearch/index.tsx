'use client'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { ComponentProps } from "react";

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
  const t = useTranslations();

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