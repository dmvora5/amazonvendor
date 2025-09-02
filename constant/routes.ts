

export const PAGE_ROUTES = {
    SUPERADMIN: {
        ALLUSERS: "/super-admin/users/all-users",
        CREATEUSER: "/super-admin/users",
        USERDETAILS: "/super-admin/users/edit-user/",
        CREATECATEGORY: "/super-admin/category/create",
        ALLCATEGORIES: "/super-admin/category",
        REPORT: "/super-admin/reports",
        CHENNELMAX: "/super-admin/channelmax/upload-report",
        ORDER: "/super-admin/Order",
        PRODUCTDATABASE: "/super-admin/product-database",
        SCREPPEDDATA: "/super-admin/scraped-data"
    },
    AUTH: {
        LOGIN: "/"
    },
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
        ALLINVENTORYLIST: "/report/all-inventory/",

        REPORT: "/report/",
        UPLOADREPORT: "/report/upload/report/",
        UPDATEREPORT: "/report/upload/update-report/",
        GETORDER: "/report/order-type/",
        UPDATEORDER: "/report/order-type/",

        //category
        CREATECATEGORY: "/category/add-category-re-order/",
        GETALLCATEGORY: "/category/category-re-order-list/",
        CATEGORYDETAILS: "/category/category-re-order/",
        UPDATECATEGORY: "/category/category-re-order/",
        DELETECATEGORY: "/category/category-re-order/",

        //cookies
        CREATECOOKIES: "/update-cookie/",

        //2FA
        SETUP2FA: "/users/setup-2fa/",
        VERIFY2FA: "/users/setup-2fa-verify/",
    },
    
    AUTH: {
        FORGETPASSWORD: '/users/send-password-reset-code-mail/',
        RESETPASSWORD: "/users/reset-password/",
        LOGIN: "/users/login/"
    }
}