'use client'

import { SessionProvider } from 'next-auth/react'

const Providers = ({ children, ...rest }: any) => {
    return <SessionProvider {...rest}>{children}</SessionProvider>

}

export default Providers