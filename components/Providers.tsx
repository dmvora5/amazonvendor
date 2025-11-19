'use client'

import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify';
import { Provider } from "react-redux";
import { store } from '@/redux/store';
import LogoutWrapper from './LogoutWrapper';

const Providers = ({ children, ...rest }: any) => {
    return (
        <>
            <Provider store={store}>
                <ToastContainer />
                <SessionProvider {...rest}>
                    <LogoutWrapper>
                        {children}
                    </LogoutWrapper>
                </SessionProvider>
            </Provider>
        </>
    )

}

export default Providers