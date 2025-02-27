import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LogOut } from "lucide-react";


const Header = () => {
    return (
        <header className="header">
            <div className="header-wrapper ml-auto">
                <form
                    action={async () => {
                        "use server";

                    }}
                >
                    <Button type="submit" className="sign-out-button">
                        <LogOut width={24} height={24} />
                    </Button>
                </form>
            </div>
        </header>
    );
};
export default Header;
