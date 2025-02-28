'use client'

import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify';


const Providers = ({ children, ...rest }: any) => {
    return (
        <>
            <ToastContainer />
            <SessionProvider {...rest}>{children}</SessionProvider>
        </>
    )

}

export default Providers