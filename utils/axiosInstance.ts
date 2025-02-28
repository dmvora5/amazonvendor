import { authOptions } from '@/lib/auth';
import axios from 'axios'
import { getServerSession } from 'next-auth';
import { getSession, signOut } from 'next-auth/react';


const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    },
});


axiosInstance.interceptors.request.use(
    async config => {
        const session: any = await getSession()
        const authorizationToken = session?.access_token || ''

        if (authorizationToken && !config?.headers?.Authorization) {
            config.headers.Authorization = `Bearer ${authorizationToken}`
        }

        if (!authorizationToken && !config?.headers?.Authorization && typeof window === 'undefined') {
            const serverSession: any = await getServerSession(authOptions)
            const serverSessionAuthorizationToken = serverSession?.access_token || ''

            if (serverSessionAuthorizationToken) {
                config.headers.Authorization = `Bearer ${serverSessionAuthorizationToken}`
            }
        }

        return config
    },
    error => Promise.reject(error)
);



axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const { response } = error
        const responseBody = response?.data
        const responseBodyData = responseBody?.data

        if (response && response?.status === 401) {
            console.log('manually logout user')

            // await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL + '/' + locale })
            await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL })
        }

        return Promise.reject(error)
    }
)

export default axiosInstance