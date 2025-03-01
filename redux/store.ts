
import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { userApi } from "./apis/usersApis"


const rootReducer = combineReducers({
    [userApi.reducerPath]: userApi.reducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({}).concat([
            userApi.middleware,
        ]),
})