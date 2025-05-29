"use client"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { ROLES } from "@/constant/roles";
import { cn } from "@/lib/utils";
import { ALargeSmall, ChevronDown, PackageIcon, Table, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";



const menu = [
    {
        title: "Users",
        Icon: Users,
        access: "has_usermanagement",
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
        access: "has_reports_access",
        subMenus: [
            // {
            //     title: "All Inventory",
            //     url: "/super-admin/inventory/all-inventory",
            //     Icon: Table
            // },
            {
                title: "Report",
                url: "/super-admin/reports",
                Icon: Table,
            },
            // {
            //     title: "FBA Pivot",
            //     url: "/super-admin/inventory/fba/pivot",
            //     Icon: Table
            // },
            // {
            //     title: "7 Days",
            //     url: "/super-admin/inventory/sevenDays/inventory",
            //     Icon: Table
            // },
            // {
            //     title: "7 Days Pivot",
            //     url: "/super-admin/inventory/sevenDays/pivot",
            //     Icon: Table
            // },
            // {
            //     title: "14 Days",
            //     url: "/super-admin/inventory/fourteenDays/inventory",
            //     Icon: Table
            // },
            // {
            //     title: "14 Days Pivot",
            //     url: "/super-admin/inventory/fourteenDays/pivot",
            //     Icon: Table
            // },
            // {
            //     title: "30 Days Sales",
            //     url: "/super-admin/inventory/thirtyDays/inventory",
            //     Icon: Table
            // },
            // {
            //     title: "30 Days Pivot",
            //     url: "/super-admin/inventory/thirtyDays/pivot",
            //     Icon: Table
            // }
        ]
    },
    {
        title: "Category",
        Icon: Users,
        access: "has_category_access",
        subMenus: [
            {
                title: "All Category",
                url: "/super-admin/category",
                Icon: ALargeSmall
            }
        ]
    },
    {
        title: "ChannelMax",
        access: "has_cm_access",
        Icon: PackageIcon,
        subMenus: [
            {
                title: "Upload Report",
                url: "/super-admin/channelmax/upload-report",
                Icon: PackageIcon
            }
        ]
    },
    {
        title: "Order",
        access: "has_order_access",
        Icon: PackageIcon,
        subMenus: [
            {
                title: "Order Type",
                url: "/super-admin/Order",
                Icon: PackageIcon
            }
        ]
    },
    {
        title: "Product Database",
        Icon: PackageIcon,
        access: "has_product_db_access",
        subMenus: [
            {
                title: "Product Database",
                url: "/super-admin/product-database",
                Icon: PackageIcon
            }
        ]
    },
    {
        title: "Scraped data",
        Icon: PackageIcon,
        access: "has_scraped_data_access",
        subMenus: [
            {
                title: "Scraped data",
                url: "/super-admin/scraped-data",
                Icon: PackageIcon
            }
        ]
    }

]




const AppSidebar = ({ session }: any) => {

    console.log('sessionInside app side bar', session)

    const items = session?.user ? menu : [];

    const pathname = usePathname();

    const MenuItem = ({ item }: any) => {

        if (session?.user?.is_superuser) {
            return (
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
                                    {item.subMenus.map((subItem: any) => (
                                        <SidebarMenuItem key={subItem.title} className="p-2">
                                            <SidebarMenuButton asChild className="pl-5">
                                                <Link href={subItem.url} className={cn(
                                                    "sidebar-nav-item p-5",
                                                    pathname == subItem.url && "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:text-white"
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
            )
        }

        if (item?.access && session?.user[item?.access]) {
            return (
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
                                    {item.subMenus.map((subItem: any) => (
                                        <SidebarMenuItem key={subItem.title} className="p-2">
                                            <SidebarMenuButton asChild className="pl-5">
                                                <Link href={subItem.url} className={cn(
                                                    "sidebar-nav-item p-5",
                                                    pathname == subItem.url && "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:text-white"
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
            )
        }

        return <></>

    }

    return (<>
        <Sidebar className="pt-16 z-40 border-none" >
            {/* <SidebarHeader className="bg-white h-16">
            </SidebarHeader> */}
            <SidebarContent className="bg-white">
                {items.map(item => (
                    <MenuItem key={item?.title} item={item} />
                ))}
            </SidebarContent>
        </Sidebar>
    </>

    )
}

export default AppSidebar