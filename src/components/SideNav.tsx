import { Link } from "@heroui/link";
import { MdOutlineDashboard } from "react-icons/md";
import { LuBuilding2 } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { useLocation } from "react-router-dom";

export default function SideNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { href: "/", label: "Overview", icon: MdOutlineDashboard },
    { href: "/companies", label: "Companies", icon: LuBuilding2 },
    { href: "/users", label: "Users", icon: LuUsers },
  ];

  return (
    <aside className="hidden md:flex w-64 shrink-0 bg-muted/30 flex-col gap-4 bg-[#1e1e1e]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isSelected = currentPath === item.href;

        return (
          <div
            key={item.href}
            className={`flex gap-2 items-center w-full px-4 py-2 relative hover:cursor-pointer ${
              isSelected
                ? "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-white before:rounded-r-full"
                : ""
            }`}
          >
            <Icon />
            <Link href={item.href} className="text-foreground">
              {item.label}
            </Link>
          </div>
        );
      })}
    </aside>
  );
}
