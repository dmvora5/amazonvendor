import { API_ROUTES } from "@/constant/routes";
import { baseQueryWithAuth } from "@/utils/RtkApiCall";
import { createApi } from "@reduxjs/toolkit/query/react"

export const userApi = createApi({
    baseQuery: baseQueryWithAuth,
    reducerPath: "users" as any,
    tagTypes: ["Auth" as never, "UserProfile" as never, "Inventory" as never, "Category" as never, "Report"],
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
                body: payload,
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
        getAdminProfile: build.query({
            query: () => ({
                url: API_ROUTES.SUPERADMIN.GETADMIN,
                method: "GET",
            }),
            providesTags: (result: any) => [
                { type: 'UserProfile', id: result },
            ]
        }),
        updateAdminProfile: build.mutation({
            query: (payload: any) => ({
                url: API_ROUTES.SUPERADMIN.UPDATEADMIN,
                method: "PATCH",
                body: {
                    first_name: payload?.first_name,
                    last_name: payload?.last_name,
                },
            }),
            invalidatesTags: (result: any, error: any) => [
                // { type: 'Auth', id: 'LIST' },
                { type: 'UserProfile', id: result },
            ]
        }),
        getFBAInventory: build.query({
            query: (id: any) => ({
                url: `${API_ROUTES.SUPERADMIN.FBAINVENTORY}`,
                method: "GET",
                params: {
                    page: id.page,
                    page_size: id.limit
                },
            }),
            providesTags: (result: any) => [
                { type: 'Inventory', id: +result?.id },
            ]
        }),
        getInventory: build.query({
            query: (period: any) => ({
                url: `${API_ROUTES.SUPERADMIN.INVENTORY}${period.time}/`,
                method: "GET",
                params: {
                    page: period.page,
                    page_size: period.limit
                },

            }),
            // providesTags: (result: any) => result ? result.results.map(({ id }: any) => ({ type: 'Inventory', id })) : [],
            // forceRefetch: ({ currentArg, previousArg }: any) => {
            //     console.log("🚀 ~ currentArg, previousArg:", currentArg, previousArg)
            //     return true // Refetch when page changes
            // },
            refetchOnMountOrArgChange: true

        },


        ),
        getFBAInventoryPivot: build.query({
            query: (id: any) => ({
                url: `${API_ROUTES.SUPERADMIN.FBAINVENTORYPIVOT}`,
                method: "GET",
                params: {
                    page: id.page,
                    page_size: id.limit
                },
            }),
            providesTags: (result: any) => [
                { type: 'Inventory', id: +result?.id },
            ]
        }),
        getInventoryPivot: build.query({
            query: (period: any) => ({
                url: `${API_ROUTES.SUPERADMIN.INVENTORYPIVOT}${period.time}/`,
                method: "GET",
                params: {
                    page: period.page,
                    page_size: period.limit
                },
            }),
            providesTags: (result: any) => [
                { type: 'Inventory', id: +result?.id },
            ]
        }),
        getAllInventoryList: build.query({
            query: (period: any) => ({
                url: `${API_ROUTES.SUPERADMIN.ALLINVENTORYLIST}`,
                method: "GET",
                params: {
                    page: period.page,
                    page_size: period.limit
                },
            }),
            providesTags: (result: any) => [
                { type: 'Inventory', id: +result?.id },
            ]
        }),

        //category
        addCategory: build.mutation({
            query: (payload: any) => ({
                url: API_ROUTES.SUPERADMIN.CREATECATEGORY,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }]
        }),
        getAllCategory: build.query({
            query: () => ({
                url: API_ROUTES.SUPERADMIN.GETALLCATEGORY,
                method: "GET",
            }),
            providesTags: (result: any) => result ?
                [
                    { type: 'Category', id: 'LIST' }, // Tag the list of users
                    ...result.map(({ id }: any) => ({ type: 'Category', id: +id })) // Tag each individual user by ID
                ] : []
        }),
        editCategory: build.query({
            query: (id: any) => ({
                url: `${API_ROUTES.SUPERADMIN.CATEGORYDETAILS}${id}/`,
                method: "GET",
            }),
            providesTags: (result: any) => [
                { type: 'Category', id: +result?.id },
            ]
        }),
        updateCategory: build.mutation({
            query: (payload: any) => (console.log('payload :>> ', payload),
            {
                url: API_ROUTES.SUPERADMIN.UPDATECATEGORY + payload.id + "/",
                method: "PATCH",
                body: {
                    ...payload,
                },
            }
            ),
            invalidatesTags: (result: any, error: any, { id }: any) => {
                console.log('id', id)
                return [
                    { type: 'Category', id: 'LIST' },
                    { type: 'Category', id: +id },
                ]
            }
        }),
        deletecategory: build.mutation({
            query: (id: any) => ({
                url: API_ROUTES.SUPERADMIN.DELETECATEGORY + id + "/",
                method: "DELETE",
            }),
            invalidatesTags: (result: any, error: any, { id }: any) => [
                { type: 'Auth', id: 'LIST' },
                { type: 'Auth', id: +id },
            ]

        }),

        //keep only this report in future
        getReport: build.query({
            query: (type: any) => ({
                url: `${API_ROUTES.SUPERADMIN.REPORT}${type}/`,
                method: "GET",
            }),
            providesTags: ["Report"]
        }),
        uploadReport: build.mutation({
            query: (payload: any) => ({
                url: API_ROUTES.SUPERADMIN.UPLOADREPORT,
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["Report"]
        }),
        updateReport: build.mutation({
            query: (payload: any) => ({
                url: API_ROUTES.SUPERADMIN.UPDATEREPORT,
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["Report"]
        }),

        //order
        getOrder: build.query({
            query: (type: any) => ({
                url: `${API_ROUTES.SUPERADMIN.GETORDER}`,
                method: "GET",
            }),
            providesTags: ["Report"]
        }),
        updateOrder: build.mutation({
            query: (payload: any) => ({
                url: API_ROUTES.SUPERADMIN.UPDATEORDER,
                method: "PATCH",
                body: {
                    ...payload,
                },
            }),
            invalidatesTags: ["Report"],
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
    useResetPasswordMutation,
    useGetAdminProfileQuery,
    useUpdateAdminProfileMutation,
    useGetFBAInventoryQuery,
    useGetInventoryQuery,
    useGetFBAInventoryPivotQuery,
    useGetInventoryPivotQuery,
    useGetAllInventoryListQuery,
    useGetReportQuery,
    useUploadReportMutation,
    useUpdateReportMutation,
    useGetOrderQuery,
    useUpdateOrderMutation,

    //category
    useAddCategoryMutation,
    useGetAllCategoryQuery,
    useEditCategoryQuery,
    useUpdateCategoryMutation,
    useDeletecategoryMutation
} = userApi;