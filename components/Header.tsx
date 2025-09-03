"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Shield } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { useGetAdminProfileQuery, useUpdateAdminProfileMutation } from "@/redux/apis/usersApis";
import { SidebarTrigger } from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { PAGE_ROUTES } from "@/constant/routes";

const Header = () => {
  const [userData, setUserData] = useState({ firstName: "", lastName: "" });

  const { data, isSuccess } = useGetAdminProfileQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateAdminProfileMutation();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess && (data as any)?.user) {
      setUserData({
        firstName: (data as any).user.first_name || "",
        lastName: (data as any).user.last_name || "",
      });
    }
  }, [data, isSuccess]);

  const handleSignOut = async (e: any) => {
    e.preventDefault();
    await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL });
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50">
      <SidebarTrigger />

      <div className="header-wrapper ml-auto text-end flex gap-2 p-4 max-w-screen-lg">
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
