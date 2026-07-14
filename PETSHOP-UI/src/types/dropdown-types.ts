export type DropdownMenuItemTypes = {
  label: string;
  value?: string;
  children?: DropdownMenuItemTypes[];
};

export type DropdownMenuGroupTypes = {
  label: string;
  items: DropdownMenuItemTypes[];
  separator?: never;
};

export type DropdownMenuSeparatorTypes = {
  separator: true;
};
