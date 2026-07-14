'use client';

import { DropdownMenuGroupTypes, DropdownMenuItemTypes, DropdownMenuSeparatorTypes } from '@/types/dropdown-types';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button>Profile</Button>} />
      <DropdownMenuContent>
        {DROPDOWN_MENUS.map((menu, index) => {
          return <RenderMenu menu={menu} key={index} />;
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RenderMenu({ menu }: { menu: DropdownMenu }) {
  if (menu.separator) {
    return <DropdownMenuSeparator />;
  }

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>{menu.label}</DropdownMenuLabel>

      {menu.items.map((item, idx) => (
        <RenderMenuItem item={item} key={idx} />
      ))}
    </DropdownMenuGroup>
  );
}

function RenderMenuItem({ item }: { item: DropdownMenuItemTypes }) {
  if (item.children) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>{item.label}</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            {item.children.map((item, idx) => (
              <RenderMenuItem item={item} key={idx} />
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    );
  }

  return <DropdownMenuItem>{item.label}</DropdownMenuItem>;
}

const DROPDOWN_MENUS: DropdownMenu[] = [
  {
    label: 'Profile',
    items: [
      {
        label: 'My Account',
        value: 'account',
        children: [
          {
            label: 'Edit',
            value: 'edit',
          },
        ],
      },
    ],
  },
  {
    separator: true,
  },
];

type DropdownMenu = DropdownMenuGroupTypes | DropdownMenuSeparatorTypes;
