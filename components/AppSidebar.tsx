"use client"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { ROLES } from "@/constant/roles";
import { cn } from "@/lib/utils";
import { ChevronDown, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";



const menu = {
    [ROLES.SUPER_ADMIN]: [
        {
            title: "Users",
            Icon: Users,
            subMenus: [
                {
                    title: "All Users",
                    url: "/super-admin/users/all-users",
                    Icon: Users
                },
                {
                    title: "Create Users",
                    url: "/super-admin/users",
                    Icon: Users
                }
            ]
        },
        {
            title: "Inventory Reports",
            Icon: Users,
            subMenus: [
                {
                    title: "All Users",
                    url: "/super-admin/users/all-users",
                    Icon: Users
                },
                {
                    title: "Create Users",
                    url: "/super-admin/users",
                    Icon: Users
                }
            ]
        }
    ]
}



const AppSidebar = ({ session }: any) => {

    console.log('sessionInside app side bar', session)

    const items = session?.user?.is_superuser ? menu[ROLES.SUPER_ADMIN] : [];

    const pathname = usePathname();

    return (<>
        <Sidebar className="pt-16 z-40 border-none" >
            {/* <SidebarHeader className="bg-white h-16">
            </SidebarHeader> */}
            <SidebarContent className="bg-white">
                {items.map(item => (
                    <Collapsible key={item.title} /*defaultOpen*/ className="group/collapsible">
                        <SidebarGroup>
                            <SidebarGroupLabel asChild>
                                <CollapsibleTrigger>
                                    <div className="flex gap-4 items-center">
                                        <p className="text-[16px] font-semibold p-5">{item.title}</p>
                                    </div>
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarGroupContent className="">
                                    <SidebarMenu>
                                        {item.subMenus.map((subItem) => (
                                            <SidebarMenuItem key={subItem.title} className="p-2">
                                                <SidebarMenuButton asChild className="pl-5">
                                                    <Link href={subItem.url} className={cn(
                                                        "sidebar-nav-item p-5",
                                                        pathname == subItem.url && "bg-brand text-white"
                                                    )}>
                                                        <subItem.Icon />
                                                        <span className="p-3">{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                ))}
            </SidebarContent>
        </Sidebar>
    </>

    )
}

export default AppSidebar