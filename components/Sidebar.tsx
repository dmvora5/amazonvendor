"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

interface Props {
    fullName: string;
    avatar: string;
    email: string;
}


const navItems = [
    {
        url: "/super-admin/users",
        name: "Users",
        icon: "/assets/icons/dashboard.svg",

    },
   
]

const Sidebar = () => {
    const pathname = usePathname();

    console.log('pathname', pathname)

    return (
        <aside className="sidebar">
            <Link href="/">
                {/* <Image
                    src=""
                    alt="logo"
                    width={160}
                    height={50}
                    className="hidden h-auto lg:block"
                />

                <Image
                    src=""
                    alt="logo"
                    width={52}
                    height={52}
                    className="lg:hidden"
                /> */}
                <div className="h-12" />
            </Link>

            <nav className="sidebar-nav">
                <ul className="flex flex-1 flex-col gap-6">
                    {navItems.map(({ url, name, icon }) => (
                        <Link key={name} href={url} className="lg:w-full">
                            <li
                                className={cn(
                                    "sidebar-nav-item",
                                    pathname.includes(name.toLowerCase()) && "shad-active",
                                )}
                            >
                                <Users width={24}
                                    height={24} className={cn(

                                        pathname === url && "nav-icon-active",
                                    )} />
                                <p className="hidden lg:block">{name}</p>
                            </li>
                        </Link>
                    ))}
                </ul>
            </nav>

        </aside>
    );
};
export default Sidebar;
