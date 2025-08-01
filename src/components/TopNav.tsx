import { Avatar } from "@heroui/avatar";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { FaCaretDown, FaCaretLeft } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { ThemeSwitch } from "@/components/theme-switch";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useState } from "react";

export default function TopNav({ onMenuClick }: { onMenuClick: () => void }) {
  const [opened, setIsOpenend] = useState(false);

  return (
    <header className="w-full px-6 py-1 bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left: Brand & Menu Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="md"
            className="md:hidden"
            onPress={onMenuClick}
          >
            <IoMdMenu className="h-5 w-5" />
          </Button>
          <span className="text-xl font-semibold">Revalyze</span>
        </div>

        {/* Center: Search */}
        {/* <div className="hidden md:flex flex-1 justify-center max-w-md">
          <Input placeholder="Search..." className="w-full" />
        </div> */}

        {/* Right: Avatar */}

        <div className="flex items-center">
          {/* <ThemeSwitch /> */}
          <Dropdown
            placement="bottom-end"
            onOpenChange={(val) => setIsOpenend(val)}
          >
            <DropdownTrigger>
              <div className="flex items-center gap-4">
                <Avatar
                  isBordered
                  size="sm"
                  as="button"
                  className="transition-transform"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    Samantha de Jong
                  </span>
                  <span className="text-xs text-gray-400">Administrator</span>
                </div>

                {opened ? <FaCaretLeft /> : <FaCaretDown />}
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">zoey@example.com</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
