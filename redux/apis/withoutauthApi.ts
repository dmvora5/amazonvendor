




import { API_ROUTES } from "@/constant/routes";
import { baseQuery } from "@/utils/RtkApiCall";
import { createApi } from "@reduxjs/toolkit/query/react"

export const mfaApi = createApi({
    baseQuery: baseQuery,
    reducerPath: "mfa" as any,
    tagTypes: ["Mfa" as never],
    endpoints: (build: any) => ({
        verify2fa: build.mutation({
            query: (payload: any) => ({
                url: API_ROUTES.SUPERADMIN.VERIFY2FA,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: [{ type: '2FA'}]
        }),
    })
});

export const {
    useVerify2faMutation,
} = mfaApi;