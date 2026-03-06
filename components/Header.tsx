"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, Bell } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import {
  useGetAdminProfileQuery,
  useGetNotificationsQuery,
  useUpdateAdminProfileMutation,
} from "@/redux/apis/usersApis";
import { SidebarTrigger } from "./ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { PAGE_ROUTES } from "@/constant/routes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Header = () => {
  const [userData, setUserData] = useState({ firstName: "", lastName: "" });
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<any[]>([]);
  // const [nextUrl, setNextUrl] = useState<string | null>(null);

  const { data, isSuccess } = useGetAdminProfileQuery({});
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateAdminProfileMutation();
  const {
    data: notificaionData,
    isLoading,
    isError,
    isFetching,
    isSuccess: isNotificationSuccess,
  } = useGetNotificationsQuery(page) as any;
  const router = useRouter();

  useEffect(() => {
    if (isSuccess && (data as any)?.user) {
      setUserData({
        firstName: (data as any).user.first_name || "",
        lastName: (data as any).user.last_name || "",
      });
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (isNotificationSuccess && notificaionData) {
      setNotifications((prev) =>
        page === 1
          ? notificaionData.results
          : [...prev, ...notificaionData.results]
      );
    }
  }, [notificaionData, isNotificationSuccess, page]);

  const handleSignOut = async (e: any) => {
    e.preventDefault();
    await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL });
  };

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    const bottom = scrollHeight - scrollTop <= clientHeight + 10;

    if (
      bottom &&
      notificaionData?.next && // next page exists
      !isFetching // prevent duplicate calls
    ) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50">
      <SidebarTrigger />

      <div className="header-wrapper ml-auto text-end flex gap-2 p-4 max-w-screen-lg">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              type="button"
              className="relative sign-out-button"
            >
              <Bell width={22} height={22} />

              {/* Notification Badge */}
              {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {notifications.length}
              </span> */}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-80 p-0">
            <div className="border-b p-3 font-semibold">Notifications</div>

            <div className="max-h-64 overflow-y-auto" onScroll={handleScroll}>
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                >
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              ))}

              {isLoading && (
                <div className="p-3 text-xs text-gray-400 text-center">
                  Loading...
                </div>
              )}
            </div>

            {notifications.length === 0 && !isLoading && (
              <div className="p-4 text-sm text-gray-500 text-center">
                No notifications
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* MFA Page Redirect */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                type="button"
                className="sign-out-button"
                onClick={() => router.push(PAGE_ROUTES.SUPERADMIN.MFA)}
              >
                <Shield width={22} height={22} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Manage MFA</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Logout Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                type="button"
                className="sign-out-button"
                onClick={handleSignOut}
              >
                <LogOut width={24} height={24} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sign Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};

export default Header;
