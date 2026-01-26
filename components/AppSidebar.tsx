"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ROLES } from "@/constant/roles";
import { cn } from "@/lib/utils";
import {
  ALargeSmall,
  ChevronDown,
  PackageIcon,
  Table,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const reportMenu = [
  "has_all_inventory_access",
  "has_cm_access",
  "has_category_access",
  "has_current_inventory_access",
  "has_fba_access",
  "has_order_history_access",
  "has_shipped_history_access",
  "has_order_access",
  "has_product_db_access",
  "has_scraped_data_access",
  "has_upload_report_access",
  "has_cookies_access",
  "has_current_inventory_upload_download_access",
  "has_product_db_upload_download_access",
  "has_fba_inventory_access",
  "has_fee_preview_access",
  "has_referral_fee_preview_access",
  "has_cost_db_access",
  "has_cost_db_upload_download_access",
  "has_pricing_calculation_report_access",
];

// const menu = [
//     {
//         title: "Users",
//         Icon: Users,
//         access: "has_usermanagement",
//         subMenus: [
//             {
//                 title: "All Users",
//                 url: "/super-admin/users/all-users",
//                 Icon: Users
//             },
//             {
//                 title: "Create Users",
//                 url: "/super-admin/users",
//                 Icon: Users
//             }
//         ]
//     },
//     {
//         title: "Inventory Reports",
//         access: "pass",
//         Icon: Users,
//         subMenus: [

//             {
//                 title: "All Inventory",
//                 url: "/super-admin/all-inventory",
//                 Icon: Table,
//                 access: "has_all_inventory_access"
//             },
//             // {
//             //     title: "Channel Max",
//             //     url: "/super-admin/channel-max",
//             //     Icon: Table,
//             //     access: "has_cm_access"

//             // },
//             // {
//             //     title: "Current Inventory",
//             //     url: "/super-admin/current-inventory",
//             //     Icon: Table,
//             //     access: "has_current_inventory_access"

//             // },
//             {
//                 title: "FBA Inventory",
//                 url: "/super-admin/fba-inventory",
//                 Icon: Table,
//                 access: "has_fba_access"

//             },
//             {
//                 title: "Order History",
//                 url: "/super-admin/order-history",
//                 Icon: Table,
//                 access: "has_order_history_access"

//             },
//             {
//                 title: "Shipped History",
//                 url: "/super-admin/shipped-history",
//                 Icon: Table,
//                 access: "has_shipped_history_access"

//             },

//         ]
//     },
//     {
//         title: "Category",
//         Icon: Users,
//         access: "has_category_access",
//         subMenus: [
//             {
//                 title: "All Category",
//                 url: "/super-admin/category",
//                 Icon: ALargeSmall
//             }
//         ]
//     },
//     {
//         title: "ChannelMax",
//         access: "has_cm_access",
//         Icon: PackageIcon,
//         subMenus: [
//             {
//                 title: "Channel Max",
//                 url: "/super-admin/channel-max",
//                 Icon: Table,
//                 access: "has_cm_access"

//             },
//             {
//                 title: "Upload Report",
//                 url: "/super-admin/channelmax/upload-report",
//                 Icon: PackageIcon
//             }
//         ]
//     },
//     {
//         title: "Order",
//         access: "has_order_access",
//         Icon: PackageIcon,
//         subMenus: [
//             {
//                 title: "Order Type",
//                 url: "/super-admin/Order",
//                 Icon: PackageIcon
//             }
//         ]
//     },
//     {
//         title: "Product Database",
//         Icon: PackageIcon,
//         access: "has_product_db_access",
//         subMenus: [
//             {
//                 title: "Product Database",
//                 url: "/super-admin/product-database",
//                 Icon: PackageIcon
//             },
//             {
//                 title: "Upload Report",
//                 url: "/super-admin/productdatabase/upload-report",
//                 Icon: PackageIcon
//             }
//         ]
//     },
//     {
//         title: "Scraped Data",
//         Icon: PackageIcon,
//         access: "has_scraped_data_access",
//         subMenus: [
//             {
//                 title: "Scraped Data",
//                 url: "/super-admin/scraped-data",
//                 Icon: PackageIcon
//             }
//         ]
//     },
//     {
//         title: "Current Inventory",
//         Icon: PackageIcon,
//         access: "has_current_inventory_access",
//         subMenus: [
//             {
//                 title: "Current Inventory",
//                 url: "/super-admin/current-inventory",
//                 Icon: Table,
//                 access: "has_current_inventory_access"

//             },
//             {
//                 title: "Upload Report",
//                 url: "/super-admin/current-inventory/upload-report",
//                 Icon: PackageIcon
//             }
//         ]
//     },
//     {
//         title: "Upload Inventory Reports",
//         Icon: PackageIcon,
//         access: "has_upload_report_access",
//         subMenus: [
//             {
//                 title: "Upload Report",
//                 url: "/super-admin/upload-report",
//                 Icon: PackageIcon
//             }
//         ]
//     },
//     {
//         title: "Cookies",
//         Icon: PackageIcon,
//         access: "has_cookies_access",
//         subMenus: [
//             {
//                 title: "Cookies",
//                 url: "/super-admin/cookies",
//                 Icon: PackageIcon
//             }
//         ]
//     },

// ]

const menu = [
  {
    title: "Category",
    Icon: Users,
    access: "has_category_access",
    subMenus: [
      {
        title: "All Category",
        url: "/super-admin/category",
        Icon: ALargeSmall,
      },
    ],
  },
  {
    title: "ChannelMax",
    access: "has_cm_access",
    Icon: PackageIcon,
    subMenus: [
      {
        title: "Channel Max",
        url: "/super-admin/channel-max",
        Icon: Table,
        access: "has_cm_access",
      },
      {
        title: "Upload Report",
        url: "/super-admin/channelmax/upload-report",
        Icon: PackageIcon,
      },
    ],
  },
  {
    title: "Cookies",
    Icon: PackageIcon,
    access: "has_cookies_access",
    subMenus: [
      {
        title: "Cookies",
        url: "/super-admin/cookies",
        Icon: PackageIcon,
      },
    ],
  },

  /* 🔹 NEW: Cost Database */
  {
    title: "Cost Database",
    Icon: PackageIcon,
    access: "pass",
    subMenus: [
      {
        title: "Cost Database",
        url: "/super-admin/cost-database",
        Icon: PackageIcon,
        access: "has_cost_db_access",
      },
      {
        title: "Upload Report",
        url: "/super-admin/cost-database/upload-report",
        Icon: PackageIcon,
        access: "has_cost_db_upload_download_access",
      },
    ],
  },

  {
    title: "Current Inventory",
    Icon: PackageIcon,
    access: "pass",
    subMenus: [
      {
        title: "Current Inventory",
        url: "/super-admin/current-inventory",
        Icon: Table,
        access: "has_current_inventory_access",
      },
      {
        title: "Upload Report",
        url: "/super-admin/current-inventory/upload-report",
        Icon: PackageIcon,
        access: "has_current_inventory_upload_download_access",
      },
    ],
  },
  {
    title: "Inventory Reports",
    access: "pass",
    Icon: Users,
    subMenus: [
      {
        title: "All Inventory",
        url: "/super-admin/all-inventory",
        Icon: Table,
        access: "has_all_inventory_access",
      },
      {
        title: "Inventory Age",
        url: "/super-admin/inventory-reports",
        Icon: Table,
        access: "has_fba_inventory_access",
      },
      {
        title: "FBA Inventory",
        url: "/super-admin/fba-inventory",
        Icon: Table,
        access: "has_fba_access",
      },
      {
        title: "Order History",
        url: "/super-admin/order-history",
        Icon: Table,
        access: "has_order_history_access",
      },
      {
        title: "Shipped History",
        url: "/super-admin/shipped-history",
        Icon: Table,
        access: "has_shipped_history_access",
      },
    ],
  },
  {
    title: "Order",
    access: "has_order_access",
    Icon: PackageIcon,
    subMenus: [
      {
        title: "Order Type",
        url: "/super-admin/Order",
        Icon: PackageIcon,
      },
    ],
  },

  /* 🔹 NEW: Pricing */
  {
    title: "Pricing",
    Icon: PackageIcon,
    access: "has_pricing_calculation_report_access",
    subMenus: [
      {
        title: "Fee Preview",
        url: "/super-admin/fee-preview", //TO Do add route
        Icon: PackageIcon,
        access: "has_fee_preview_access",
      },
      {
        title: "Referral Fee Preview",
        url: "/super-admin/referral-fee-preview", //TO Do add route
        Icon: PackageIcon,
        access: "has_referral_fee_preview_access",
      },
      {
        title: "Price Calculation",
        url: "/super-admin/pricing-calculation", //TO Do add route
        Icon: PackageIcon,
        access: "has_referral_fee_preview_access",
      },
    ],
  },

  {
    title: "Product Database",
    Icon: PackageIcon,
    access: "pass",
    subMenus: [
      {
        title: "Product Database",
        url: "/super-admin/product-database",
        Icon: PackageIcon,
        access: "has_product_db_access",
      },
      {
        title: "Upload Report",
        url: "/super-admin/productdatabase/upload-report",
        Icon: PackageIcon,
        access: "has_product_db_upload_download_access",
      },
    ],
  },
  {
    title: "Scraped Data",
    Icon: PackageIcon,
    access: "has_scraped_data_access",
    subMenus: [
      {
        title: "Scraped Data",
        url: "/super-admin/scraped-data",
        Icon: PackageIcon,
      },
    ],
  },
  {
    title: "Upload Inventory Reports",
    Icon: PackageIcon,
    access: "has_upload_report_access",
    subMenus: [
      {
        title: "Upload Report",
        url: "/super-admin/upload-report",
        Icon: PackageIcon,
      },
    ],
  },
  {
    title: "Users",
    Icon: Users,
    access: "has_usermanagement",
    subMenus: [
      {
        title: "All Users",
        url: "/super-admin/users/all-users",
        Icon: Users,
      },
      {
        title: "Create Users",
        url: "/super-admin/users",
        Icon: Users,
      },
    ],
  },
];

const isShowReportMenu = (session: any, subMenu = reportMenu) => {
  const keys = Object.keys(session?.user);

  for (const key of subMenu) {
    if (session?.user[key]) {
      return true;
    }
  }

  return false;
};

const AppSidebar = ({ session }: any) => {
  console.log("sessionInside app side bar", session);

  const items = session?.user ? menu : [];

  const pathname = usePathname();

  const SubMenu = ({ subItem }: any) => {
    if (subItem?.access) {
      if (session?.user[subItem?.access]) {
        return (
          <SidebarMenuItem key={subItem.title} className="p-2">
            <SidebarMenuButton asChild className="pl-5">
              <Link
                href={subItem.url}
                className={cn(
                  "sidebar-nav-item p-5",
                  pathname == subItem.url &&
                    "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:text-white"
                )}
              >
                <subItem.Icon />
                <span className="p-3">{subItem.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      } else {
        return <></>;
      }
    } else {
      return (
        <SidebarMenuItem key={subItem.title} className="p-2">
          <SidebarMenuButton asChild className="pl-5">
            <Link
              href={subItem.url}
              className={cn(
                "sidebar-nav-item p-5",
                pathname == subItem.url &&
                  "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:text-white"
              )}
            >
              <subItem.Icon />
              <span className="p-3">{subItem.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }
  };

  const MenuItem = ({ item }: any) => {
    isShowReportMenu(session);
    if (session?.user?.is_superuser) {
      return (
        <Collapsible
          key={item.title}
          /*defaultOpen*/ className="group/collapsible"
        >
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
                        <Link
                          href={subItem.url}
                          className={cn(
                            "sidebar-nav-item p-5",
                            pathname == subItem.url &&
                              "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:text-white"
                          )}
                        >
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
      );
    }

    if (
      item?.access == "pass" &&
      isShowReportMenu(
        session,
        item?.subMenus.map((ele: any) => ele?.access)
      )
    ) {
      return (
        <Collapsible
          key={item.title}
          /*defaultOpen*/ className="group/collapsible"
        >
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
                  {console.log("item", item)}
                  {item.subMenus.map((subItem: any) => (
                    <SubMenu subItem={subItem} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      );
    }

    if (item?.access !== "pass" && session?.user[item?.access]) {
      return (
        <Collapsible
          key={item.title}
          /*defaultOpen*/ className="group/collapsible"
        >
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
                  {console.log("item", item)}
                  {item.subMenus.map((subItem: any) => (
                    <SubMenu subItem={subItem} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      );
    }

    return <></>;
  };

  return (
    <>
      <Sidebar className="pt-16 z-40 border-none">
        {/* <SidebarHeader className="bg-white h-16">
            </SidebarHeader> */}
        <SidebarContent className="bg-white w-[290px]">
          {items.map((item) => (
            <MenuItem key={item?.title} item={item} />
          ))}
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default AppSidebar;
