export interface MenuItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: MenuItem[];
  badge?: string | number;
}

export interface SideNavProps {
  isOpen: boolean;
  onToggle: () => void;
  menuItems?: MenuItem[];
  className?: string;
}
