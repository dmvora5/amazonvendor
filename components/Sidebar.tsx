"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, ChevronDown } from "lucide-react";
import { useState } from "react";

interface Props {
  fullName: string;
  avatar: string;
  email: string;
}

const navItems = [
  {
    url: "/super-admin/users/all-users",
    name: "Users",
    icon: "/assets/icons/dashboard.svg",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isFbaOpen, setIsFbaOpen] = useState(false);
  const [isSevenDaysOpen, setIsSevenDaysOpen] = useState(false);
  const [isFourteenDaysOpen, setIsFourteenDaysOpen] = useState(false);
  const [isThirtyDaysOpen, setIsThirtyDaysOpen] = useState(false);

  return (
    <aside className="sidebar">
      <Link href="/">
        <div className="h-12" />
      </Link>

      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }) => (
            <Link key={name} href={url} className="lg:w-full">
              <li
                className={cn(
                  "sidebar-nav-item",
                  pathname.includes(url) && "shad-active"
                )}
              >
                <Users
                  width={24}
                  height={24}
                  className={cn(pathname === url && "nav-icon-active")}
                />
                <p className="hidden lg:block">{name}</p>
              </li>
            </Link>
          ))}

          {/* FBA Dropdown */}
          <li
            className={cn(
              "sidebar-nav-item cursor-pointer",
              isFbaOpen && "shad-active"
            )}
            onClick={() => setIsFbaOpen(!isFbaOpen)}
          >
            <Users width={24} height={24} />
            <p className="hidden lg:block">FBA</p>
            <ChevronDown className={cn("ml-auto", isFbaOpen && "rotate-180")} />
          </li>
          {isFbaOpen && (
            <ul className="pl-6 flex flex-col gap-4">
              <Link href="/super-admin/fba/inventory">
                <li className="sidebar-nav-item">FBA Inventory</li>
              </Link>
              <Link href="/super-admin/fba/inventory-piv">
                <li className="sidebar-nav-item">FBA Inventory Piv</li>
              </Link>
            </ul>
          )}

          {/* 7 Days Dropdown */}
          <li
            className={cn(
              "sidebar-nav-item cursor-pointer",
              isSevenDaysOpen && "shad-active"
            )}
            onClick={() => setIsSevenDaysOpen(!isSevenDaysOpen)}
          >
            <p className="hidden lg:block">7 Days</p>
            <ChevronDown
              className={cn("ml-auto", isSevenDaysOpen && "rotate-180")}
            />
          </li>
          {isSevenDaysOpen && (
            <ul className="pl-6 flex flex-col gap-4">
              <Link href="/super-admin/sevenDays/inventory">
                <li className="sidebar-nav-item">7 Days</li>
              </Link>
              <Link href="/super-admin/sevenDays/inventory-piv">
                <li className="sidebar-nav-item">7 Days Piv</li>
              </Link>
            </ul>
          )}

          {/* 14 Days Dropdown */}
          <li
            className={cn(
              "sidebar-nav-item cursor-pointer",
              isFourteenDaysOpen && "shad-active"
            )}
            onClick={() => setIsFourteenDaysOpen(!isFourteenDaysOpen)}
          >
            <p className="hidden lg:block">14 Days</p>
            <ChevronDown
              className={cn("ml-auto", isFourteenDaysOpen && "rotate-180")}
            />
          </li>
          {isFourteenDaysOpen && (
            <ul className="pl-6 flex flex-col gap-4">
              <Link href="/super-admin/fourteenDays/inventory">
                <li className="sidebar-nav-item">14 Days</li>
              </Link>
              <Link href="/super-admin/fourteenDays/inventory-piv">
                <li className="sidebar-nav-item">14 Days Piv</li>
              </Link>
            </ul>
          )}

          {/* 30 Days Dropdown */}
          <li
            className={cn(
              "sidebar-nav-item cursor-pointer",
              isThirtyDaysOpen && "shad-active"
            )}
            onClick={() => setIsThirtyDaysOpen(!isThirtyDaysOpen)}
          >
            <p className="hidden lg:block">30 Days</p>
            <ChevronDown
              className={cn("ml-auto", isThirtyDaysOpen && "rotate-180")}
            />
          </li>
          {isThirtyDaysOpen && (
            <ul className="pl-6 flex flex-col gap-4">
              <Link href="/super-admin/thirtyDays/inventory">
                <li className="sidebar-nav-item">30 Days</li>
              </Link>
              <Link href="/super-admin/thirtyDays/inventory-piv">
                <li className="sidebar-nav-item">30 Days Piv</li>
              </Link>
            </ul>
          )}
        </ul>
      </nav>
    </aside>
  );
};
export default Sidebar;
