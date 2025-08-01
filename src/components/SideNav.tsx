import { Link } from "@heroui/link";
import { useLocation } from "react-router-dom";
import {
  MdOutlineDashboard,
  MdInsights,
  MdChevronLeft,
  MdChevronRight,
  MdAdminPanelSettings,
} from "react-icons/md";
import { LuBuilding2, LuUsers, LuClipboardCheck } from "react-icons/lu";
import {
  IoDocumentOutline,
  IoPeopleOutline,
  IoBusinessOutline,
} from "react-icons/io5";
import { RiContactsBook2Line, RiShieldCheckLine } from "react-icons/ri";
import { GrScorecard, GrDocumentConfig, GrCatalog } from "react-icons/gr";
import { TbListDetails } from "react-icons/tb";
import { Avatar } from "@heroui/avatar";

interface SideNavProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export default function SideNav({ collapsed, setCollapsed }: SideNavProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const sections = [
    {
      title: "Dashboard",
      items: [
        { href: "/", label: "Overview", icon: MdOutlineDashboard },
        { href: "/insights", label: "Employee Insights", icon: MdInsights },
      ],
    },
    {
      title: "Conversation Analysis",
      items: [
        { href: "/transcripts", label: "Transcripts", icon: IoDocumentOutline },
        { href: "/reviews", label: "Reviews", icon: GrScorecard },
      ],
    },
    {
      title: "Process configuration",
      items: [
        {
          href: "/review-configs",
          label: "Review Configs",
          icon: GrDocumentConfig,
        },
        {
          href: "/criteria",
          label: "Evaluation Criteria",
          icon: LuClipboardCheck,
        },
      ],
    },
    {
      title: "Client Management",
      items: [
        { href: "/clients", label: "Clients", icon: IoPeopleOutline },
        {
          href: "/external-companies",
          label: "External Companies",
          icon: IoBusinessOutline,
        },
        { href: "/contacts", label: "Contacts", icon: RiContactsBook2Line },
      ],
    },
    {
      title: "Company Administration",
      items: [
        { href: "/companies", label: "Company Info", icon: LuBuilding2 },
        { href: "/users", label: "Users", icon: LuUsers },
        { href: "/subscriptions", label: "Subscriptions", icon: GrCatalog },
      ],
    },
  ];

  return (
    <aside
      className={`h-full bg-[#1e1e1e] text-muted-foreground transition-all duration-200 py-4 ${
        collapsed ? "w-16" : "w-52"
      } flex flex-col justify-between`}
    >
      {/* Top: Avatar and Navigation */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-center p-4">
          <Avatar
            size="sm"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            isBordered
          />
        </div>

        <nav className="flex flex-col gap-2 px-2">
          {sections.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <div className="text-xs text-gray-500 uppercase font-medium mb-1 px-2">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-2 py-2 rounded-md transition-all text-sm hover:bg-muted/50 text-foreground ${
                      isActive ? "bg-muted/70 text-white" : ""
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom: Collapse Toggle */}
      <div className="flex items-center justify-center p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-muted/50"
        >
          {collapsed ? (
            <MdChevronRight className="w-5 h-5" />
          ) : (
            <MdChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
