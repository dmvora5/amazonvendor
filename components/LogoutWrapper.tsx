"use client"
import { isLastLogin12HoursOld } from '@/utils';
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect } from 'react'

const loginCheck = () => {
    const lastLoginTime = localStorage.getItem("time");

    if (!lastLoginTime) return;

    if (isLastLogin12HoursOld(Number(lastLoginTime || 0))) {
        localStorage.removeItem("time")
        return signOut()
    }
}

const LogoutWrapper = ({ children }: any) => {

    const { data: session } = useSession();

    useEffect(() => {
        if (!session?.user) return;

        loginCheck();
    }, [session])

    return children
}

export default LogoutWrapper