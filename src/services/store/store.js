import { configureStore } from '@reduxjs/toolkit'
import thunk from "redux-thunk";
import  mapSlice  from "./slices/map";

export const store = configureStore({
    reducer: {
        map: mapSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
    devTools: process.env.NODE_ENV !== 'production',
})
