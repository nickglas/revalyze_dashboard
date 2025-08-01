import { Outlet } from "react-router-dom";
import TopNav from "@/components/TopNav";
import SideNav from "@/components/SideNav";
import { Link } from "@heroui/link";
import { Drawer, DrawerBody, DrawerContent } from "@heroui/react";

export default function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen">
      <TopNav onMenuClick={() => {}} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <SideNav />

        {/* Mobile Drawer Sidebar */}
        <Drawer isOpen={false} onClose={() => {}}>
          <DrawerContent className="w-64 bg-muted/30 border-r">
            <DrawerBody className="flex flex-col gap-4 pt-6">
              <Link href="/">Overview</Link>
              <Link href="/settings">Settings</Link>
              <Link href="#">Leaderboard</Link>
              <Link href="#">Spreadsheets</Link>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-[#131419] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
