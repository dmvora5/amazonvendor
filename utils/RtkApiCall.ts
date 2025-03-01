import { authOptions } from "@/lib/auth";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";

// Base query without auth
export const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL as any,
});

// Base query with authorization handling (client-side or server-side session)
export const baseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {
    // Get the session on the client-side
    const session: any = await getSession();
    let authorizationToken = session?.access_token || '';
    console.log('authorizationToken', authorizationToken)
    // If session is not available on client-side, try server-side session
    if (!authorizationToken) {
        try{
        const serverSession: any = await getServerSession(authOptions);
        authorizationToken = serverSession?.access_token || '';
        }catch(err) {
            // console.log('errSession', err)
        }
    }

    // Add the Authorization header if a token is found
    if (authorizationToken) {
        args = {
            ...args,
            headers: {
                ...args.headers,
                Authorization: `Bearer ${authorizationToken}`,
            },
        };
    }

    // Proceed with the request
    return await baseQuery(args, api, extraOptions);
};
