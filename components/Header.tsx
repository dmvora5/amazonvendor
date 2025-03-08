"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
} from "@/redux/apis/usersApis";
import { SidebarTrigger } from "./ui/sidebar";

const Header = () => {
  // State to store user data
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
  });

  // API Calls
  const { data, isSuccess } = useGetAdminProfileQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateAdminProfileMutation();

  // Populate user data when API returns successful response
  useEffect(() => {
    if (isSuccess && (data as any)?.user) {
      setUserData({
        firstName: (data as any).user.first_name || "",
        lastName: (data as any).user.last_name || "",
      });
    }
  }, [data, isSuccess]);

  // // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserData((prev) => ({ ...prev, [id]: value }));
  };

  // // Handle Form Submission
  const handleSaveChanges = async () => {
    try {
      await updateProfile({
        first_name: userData.firstName,
        last_name: userData.lastName,
      }).unwrap();

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  // // Handle Sign Out
  const handleSignOut = async (e: any) => {
    e.preventDefault();
    await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL });
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50">

      <SidebarTrigger />
      {/* <SidebarTrigger className="hidden max-md:block"/> */}
      <div className="header-wrapper ml-auto text-end flex gap-2 p-4 max-w-screen-lg">
        {/* Dialog (Modal) */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" type="button" className="sign-out-button">
              <User width={24} height={24} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            {/* Form */}
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
            </div>
            {/* Footer */}
            <DialogFooter>
              <Button type="button"
              onClick={handleSaveChanges} disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Logout Button */}
        <Button variant="outline" type="button" className="sign-out-button"
        onClick={handleSignOut}
        >
          <LogOut width={24} height={24} />
        </Button>
      </div>
    </header>
  );
};

export default Header;