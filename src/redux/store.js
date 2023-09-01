import { configureStore } from "@reduxjs/toolkit";
import { usersSlice } from "./usersSlice";
import { loadersSlice } from "./loadersSlice";

const store = configureStore({
    reducer: {
        loaders: loadersSlice.reducer,
        users: usersSlice.reducer,
    }
})

export default store;
