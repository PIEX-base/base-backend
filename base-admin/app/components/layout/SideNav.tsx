import { ActivitiesSVG } from "public/images/ActivitiesSVG";
import { BasketsSVG } from "public/images/BasketsSVG";
import { DonationsSVG } from "public/images/DonationsSVG";
import { FamilySVG } from "public/images/FamilySVG";
import { LogoutSVG } from "public/images/LogoutSVG";
import { MyAccountSVG } from "public/images/myAccount";
import { UsersSVG } from "public/images/UsersSVG";
import { VolunteersSVG } from "public/images/VolunteersSVG";
import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import type { MenuItem, SideNavProps } from "~/interfaces/sideNav";

const defaultMenuItems: MenuItem[] = [
  {
    label: "Minha Conta",
    href: "/account",
    icon: <MyAccountSVG />,
  },
  {
    label: "Famílias",
    href: "/families",
    icon: <FamilySVG />,
  },
  {
    label: "Doações",
    href: "/doacoes",
    icon: <DonationsSVG />,
  },
  {
    label: "Cestas Básicas",
    href: "/cestas",
    icon: <BasketsSVG />,
  },
  {
    label: "Atividades",
    href: "/atividades",
    icon: <ActivitiesSVG />,
  },
  {
    label: "Usuários",
    href: "/users",
    icon: <UsersSVG />,
  },
  {
    label: "Voluntários",
    href: "/volunteers",
    icon: <VolunteersSVG />,
  },
];

const ChevronIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export const SideNav = ({
  isOpen,
  onToggle,
  menuItems = defaultMenuItems,
  className,
}: SideNavProps) => {
  const { logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.label);
    const baseClasses = `${
      activeItem === item.label ? "bg-gray-100 dark:bg-gray-700" : ""
    } flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors ${
      level > 0 ? "pl-6" : ""
    }`;

    if (hasChildren) {
      return (
        <li key={item.label}>
          <button
            type="button"
            onClick={() => toggleExpanded(item.label)}
            className={`${baseClasses} w-full`}>
            <span className="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">
              {item.icon}
            </span>
            <span className="flex-1 ml-3 text-left whitespace-nowrap">
              {item.label}
            </span>
            <span
              className={`transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}>
              <ChevronIcon />
            </span>
          </button>

          <ul className={`${isExpanded ? "block" : "hidden"} py-2 space-y-2`}>
            {item.children?.map((child) => renderMenuItem(child, level + 1))}
          </ul>
        </li>
      );
    }

    return (
      <li key={item.label} onClick={() => setActiveItem(item.label)}>
        <Link to={item.href || "#"} className={baseClasses}>
          <span className="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
            {item.icon}
          </span>
          <span className="flex-1 ml-3 whitespace-nowrap">{item.label}</span>
          {item.badge && (
            <span className="inline-flex justify-center items-center w-5 h-5 text-xs font-semibold rounded-full text-black bg-primary dark:bg-primary dark:text-black">
              {item.badge}
            </span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        aria-controls="default-sidebar">
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        id="default-sidebar"
        className={`
          fixed top-0 left-0 z-40 w-64 h-screen transition-transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          sm:translate-x-0
          ${className || ""}
        `}
        aria-label="Sidenav">
        <div className="overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          {/* Main Navigation */}
          <ul className="space-y-2">
            {menuItems.map((item) => renderMenuItem(item))}
          </ul>

          {/* Secondary Navigation */}
          <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
            <li>
              <Link
                to="/login"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                onClick={logout}>
                <LogoutSVG />

                <span className="ml-3">Sair</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};
