import { Outlet } from "react-router-dom";
import SideNav from "@/components/SideNav";
import { useState } from "react";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex h-screen bg-[#131419]">
      <SideNav collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
