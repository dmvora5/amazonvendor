"use client"
import { getSession, signOut } from 'next-auth/react';
import React, { useEffect } from 'react'

const SuperAdminCheck = () => {

    useEffect(() => {
        (async () => {
            const session: any = await getSession();
            if (!session?.user?.is_superuser) {
                await signOut({
                    callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}`,
                })
            }
        })()
    }, [])


    return <></>
}

export default SuperAdminCheck