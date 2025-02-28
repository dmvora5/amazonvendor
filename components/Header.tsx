"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";


const Header = () => {

    const handleSignOut = async (e: any) => {
        e.preventDefault();
        console.log('process.env.NEXT_PUBLIC_APP_URL', process.env.NEXT_PUBLIC_APP_URL)
        await signOut({callbackUrl: process.env.NEXT_PUBLIC_APP_URL});
    }

    return (
        <header className="header">
            <div className="header-wrapper ml-auto">

                <Button type="button" className="sign-out-button"  onClick={handleSignOut}>
                    <LogOut width={24} height={24} />
                </Button>
            </div>
        </header>
    );
};
export default Header;
