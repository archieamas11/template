import { Bookmark, LayoutGrid, type LucideIcon, Settings, SquarePen, Tag, Users } from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  const base = pathname.startsWith('/admin') ? '/admin' : '/dashboard';

  return [
    {
      groupLabel: '',
      menus: [
        {
          href: base,
          label: 'Dashboard',
          icon: LayoutGrid,
          submenus: [],
          active: pathname === base || pathname.startsWith(`${base}/`),
        },
      ],
    },
    {
      groupLabel: 'Contents',
      menus: [
        {
          href: '',
          label: 'Posts',
          icon: SquarePen,
          submenus: [
            {
              href: '/posts',
              label: 'All Posts',
            },
            {
              href: '/posts/new',
              label: 'New Post',
            },
          ],
        },
        {
          href: '/categories',
          label: 'Categories',
          icon: Bookmark,
        },
        {
          href: '/tags',
          label: 'Tags',
          icon: Tag,
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: '/users',
          label: 'Users',
          icon: Users,
        },
        {
          href: '/account',
          label: 'Account',
          icon: Settings,
        },
      ],
    },
  ];
}
