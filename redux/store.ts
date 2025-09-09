
import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { userApi } from "./apis/usersApis"
import { mfaApi } from "./apis/withoutauthApi"


const rootReducer = combineReducers({
    [userApi.reducerPath]: userApi.reducer,
    [mfaApi.reducerPath]: mfaApi.reducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({}).concat([
            userApi.middleware,
            mfaApi.middleware
        ]),
})