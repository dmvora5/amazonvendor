"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "react-toastify";
import {
    useSetUp2faMutation,
    useDelete2faMutation,
} from "@/redux/apis/usersApis";
import { useRouter } from "next/navigation"; // ✅ import router
import { PAGE_ROUTES } from "@/constant/routes";
import { useVerify2faMutation } from "@/redux/apis/withoutauthApi";
import { useSession } from "next-auth/react";

const Mfa = ({ qr_code, cb, email }: any) => {
    const router = useRouter(); // ✅ initialize router
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [qrImageMsg, setQrImageMsg] = useState<string | null>(null);
    const [twoFACode, setTwoFACode] = useState("");

    const [setUp2fa, { isLoading: isLoadingQr }] = useSetUp2faMutation();
    const [verify2fa, { isLoading: isVerifying }] = useVerify2faMutation();
    const [delete2fa, { isLoading: isDeleting }] = useDelete2faMutation();

    const {data: session} = useSession();

    // Fetch QR Image on page load
    useEffect(() => {

        if (qr_code) {
            setQrImage(`data:image/png;base64,${qr_code}`);
        } else {

            const fetchQR = async () => {
                try {
                    const res: any = await setUp2fa({}).unwrap();
                    if (res?.qr_code) {
                        setQrImage(`data:image/png;base64,${res.qr_code}`);
                        setQrImageMsg(res.message);
                    }
                } catch (err) {
                    toast.error("Failed to load QR code");
                }
            };
            fetchQR();
        }
    }, [setUp2fa, qr_code]);

    // Verify OTP
    const handleVerify2FA = async () => {
        try {
            await verify2fa({ otp: twoFACode, email: email || session?.user?.email }).unwrap();
            toast.success("MFA Enabled Successfully!");
            setTwoFACode("");
            setQrImage(null);
            setQrImageMsg(null); // clear message after success
            if(!cb) {
                router.push(PAGE_ROUTES.SUPERADMIN.ALLUSERS);
            } else {
                cb()
            }
        } catch (err) {

            console.log('err', err)
            toast.error("Invalid Code, try again");
        }
    };

    // Disable MFA
    const handleDelete2FA = async () => {
        try {
            await delete2fa({}).unwrap();
            toast.success("MFA Disabled Successfully!");
            setTwoFACode("");
            setQrImage(null);
            setQrImageMsg(null); // clear message after disabling
            router.push(PAGE_ROUTES.SUPERADMIN.ALLUSERS);
        } catch (err) {
            toast.error("Failed to disable MFA");
        }
    };

    return (
        <>
            {/* Back Button */}
            {/* <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-2"
        >
          ⬅ Back
        </Button>
      </div> */}
            <div className="max-w-lg mx-auto mt-24 p-6 bg-white shadow rounded-lg">
                <h1 className="text-xl font-bold mb-4 text-center">Manage MFA</h1>

                {qrImageMsg && <p className="mb-2">{qrImageMsg}</p>}

                {qrImage ? (
                    <div className="flex justify-center mb-4">
                        <div className="p-6 bg-gray-50 rounded-lg flex items-center justify-center">
                            <Image src={qrImage} alt="QR Code" width={200} height={200} />
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-sm text-gray-500 mb-4">
                        {isLoadingQr ? "Loading QR..." : "No QR available"}
                    </p>
                )}

                {/* OTP Input */}
                <div className="grid grid-cols-4 items-center gap-4 mb-4">
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

                {/* Action Buttons */}
                <div className="flex justify-center">
                    <Button
                        type="button"
                        className="bg-green-600"
                        onClick={handleVerify2FA}
                        disabled={isVerifying}
                    >
                        {isVerifying ? "Verifying..." : "Verify & Enable"}
                    </Button>

                    {/* <Button
                        type="button"
                        className="bg-red-600"
                        onClick={handleDelete2FA}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Disabling..." : "Disable MFA"}
                    </Button> */}
                </div>
            </div>
        </>
    );
};

export default Mfa;
