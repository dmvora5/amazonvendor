

export const PAGE_ROUTES = {
    SUPERADMIN: {
        ALLUSERS: "/super-admin/users/all-users",
        CREATEUSER: "/super-admin/users",
        USERDETAILS: "/super-admin/users/edit-user/"
    },
    AUTH: {
        LOGIN: "/"
    }
}


export const API_ROUTES = {
    SUPERADMIN: {
        CREATEUSER: "/users/add-user/",
        GETALLUSERS: "users/user-list/",
        USERDETAILS: "/users/user-detail/",
        UPDATEUSER: "/users/user-detail/",
        DELETEUESR: "/users/user-detail/",
        GETADMIN: "/users/user-profile/",
        UPDATEADMIN: "/users/user-profile/",
        FBAINVENTORY: "/report/fba-inventory/",
        INVENTORY: "/report/",
        FBAINVENTORYPIVOT: "/report/pivot/fba-inventory/",
        INVENTORYPIVOT: "/report/pivot/",
    },
    AUTH: {
        FORGETPASSWORD: '/users/send-password-reset-code-mail/',
        RESETPASSWORD: "/users/reset-password/",
        LOGIN: "/users/login/"
    }
}