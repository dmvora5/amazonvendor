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
import { LogOut, User, Shield } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useSetUp2faMutation,
  useVerify2faMutation,
  useDelete2faMutation,
} from "@/redux/apis/usersApis";
import { SidebarTrigger } from "./ui/sidebar";
import Image from "next/image";

const Header = () => {
  // State to store user data
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
  });

  // API Calls
  const { data, isSuccess } = useGetAdminProfileQuery({});
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateAdminProfileMutation();

  // 2FA States
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [twoFACode, setTwoFACode] = useState("");
  const [open, setOpen] = useState(false);

  const [setUp2fa, { isLoading: isLoadingQr }] = useSetUp2faMutation();
  const [verify2fa, { isLoading: isVerifying }] = useVerify2faMutation();
  const [delete2fa, { isLoading: isDeleting }] = useDelete2faMutation();

  // Populate user data when API returns successful response
  useEffect(() => {
    if (isSuccess && (data as any)?.user) {
      setUserData({
        firstName: (data as any).user.first_name || "",
        lastName: (data as any).user.last_name || "",
      });
    }
  }, [data, isSuccess]);

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle Form Submission
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

  // Handle Sign Out
  const handleSignOut = async (e: any) => {
    e.preventDefault();
    await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL });
  };

  // Fetch QR Image for 2FA
  const handleEnable2FA = async () => {
    try {
      const res: any = await setUp2fa({}).unwrap();
      if (res?.qr_code) {
        setQrImage(`data:image/png;base64,${res.qr_code}`);
      }
    } catch (err) {
      console.log("🚀 ~ handleEnable2FA ~ err:", err);
      // toast.error("Failed to load QR code");
    }
  };

  // Verify 2FA Code
  const handleVerify2FA = async () => {
    try {
      await verify2fa({ otp: twoFACode }).unwrap();
      toast.success("2FA Enabled Successfully!");

      setTwoFACode("");
      setQrImage(null);
      setOpen(false); // close modal after success
    } catch (err) {
      toast.error("Invalid Code, try again");
    }
  };

  const handleDelete2FA = async () => {
    try {
      await delete2fa({}).unwrap();
      toast.success("2FA Disabled Successfully!");
      setTwoFACode("");
      setQrImage(null);
      setOpen(false);
    } catch (err) {
      toast.error("Failed to disable 2FA");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50">
      <SidebarTrigger />

      <div className="header-wrapper ml-auto text-end flex gap-2 p-4 max-w-screen-lg">
        {/* Profile Edit Dialog */}
        <Dialog>
          {/* <DialogTrigger asChild>
            <Button variant="outline" type="button" className="sign-out-button">
              <User width={24} height={24} />
            </Button>
          </DialogTrigger> */}
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
              <Button
                type="button"
                className="bg-blue-500"
                onClick={handleSaveChanges}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (val) handleEnable2FA();
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline" type="button" className="sign-out-button">
              <Shield width={22} height={22} />
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Manage 2FA</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {qrImage ? (
                <div className="flex justify-center">
                  <Image src={qrImage} alt="QR Code" width={200} height={200} />
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500">
                  {isLoadingQr ? "Loading QR..." : "Click shield to load QR"}
                </p>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="twoFACode" className="text-right">
                  Code
                </Label>
                <Input
                  id="twoFACode"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter 6-digit code"
                />
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <Button
                type="button"
                className="bg-green-600"
                onClick={handleVerify2FA}
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify & Enable"}
              </Button>

              <Button
                type="button"
                className="bg-red-600"
                onClick={handleDelete2FA}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete 2FA"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Logout Button */}
        <Button
          variant="outline"
          type="button"
          className="sign-out-button"
          onClick={handleSignOut}
        >
          <LogOut width={24} height={24} />
        </Button>
      </div>
    </header>
  );
};

export default Header;
