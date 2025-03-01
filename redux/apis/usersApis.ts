import { API_ROUTES } from "@/constant/routes"
import { baseQueryWithAuth } from "@/utils/RtkApiCall"
import { createApi } from "@reduxjs/toolkit/query/react"

export const userApi = createApi({
    baseQuery: baseQueryWithAuth,
    reducerPath: "users" as any,
    tagTypes: ["Auth" as never],
    endpoints: (build: any) => ({
        getAllUsers: build.query({
            query: () => ({
                url: API_ROUTES.SUPERADMIN.GETALLUSERS,
                method: "GET",
            }),
            providesTags: (result: any) => result ?
                [
                    { type: 'Auth', id: 'LIST' }, // Tag the list of users
                    ...result.map(({ id }: any) => ({ type: 'Auth', id: +id })) // Tag each individual user by ID
                ] : []
        }),
        deleteUser: build.mutation({
            query: (id: any) => ({
                url: API_ROUTES.SUPERADMIN.DELETEUESR + id + "/",
                method: "DELETE",
            }),
            invalidatesTags: (result: any, error: any, { id }: any) => [
                { type: 'Auth', id: 'LIST' },
                { type: 'Auth', id: +id },
            ]

        }),
        addUser: build.mutation({
            query: (payload: any) => ({
                url: API_ROUTES.SUPERADMIN.CREATEUSER,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: [{ type: 'Auth', id: 'LIST' }]
        }),
        editUser: build.query({
            query: (id: any) => ({
                url: `${API_ROUTES.SUPERADMIN.USERDETAILS}${id}/`,
                method: "GET",
            }),
            providesTags: (result: any) => [
                { type: 'Auth', id: +result?.id },
            ]
        }),
        updateUser: build.mutation({
            query: (payload: any) => ({
                url: API_ROUTES.SUPERADMIN.UPDATEUSER + payload.id + "/",
                method: "PATCH",
                body: {
                    first_name: payload?.first_name,
                    last_name: payload?.last_name,
                },
            }),
            invalidatesTags: (result: any, error: any, { id }: any) => {
                console.log('id', id)
                return [
                    { type: 'Auth', id: 'LIST' },
                    { type: 'Auth', id: +id },
                ]
            }
        }),
        forgetPassword: build.mutation({
            query: (payload: any) => {
                console.log('payload', payload)
                return {
                    url: API_ROUTES.AUTH.FORGETPASSWORD,
                    method: "POST",
                    body: payload,
                }
            }
        }),
        resetPassword: build.mutation({
            query: (payload: any) => ({
                url: API_ROUTES.AUTH.RESETPASSWORD,
                method: "POST",
                body: payload,
            })
        }),
    })
});

export const {
    useGetAllUsersQuery,
    useDeleteUserMutation,
    useAddUserMutation,
    useEditUserQuery,
    useUpdateUserMutation,
    useForgetPasswordMutation,
    useResetPasswordMutation
} = userApi;