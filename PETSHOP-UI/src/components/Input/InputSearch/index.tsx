'use client'

import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
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
  placeholder = "Cari...",
  ...props
}: InputSearchProps) {
  return (
    <InputGroup className={cn("w-full", className)}>
      <InputGroupInput
        placeholder={placeholder}
        {...props}
      />

      <InputGroupAddon>
        {icon}
      </InputGroupAddon>
    </InputGroup>
  );
}