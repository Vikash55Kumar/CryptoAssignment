import { configureStore } from "@reduxjs/toolkit";
import { cryptoReducer, targetReducer } from "./reducer/cryptoReducer";

const store = configureStore ({
    reducer: {
        crypto:cryptoReducer,
        cryptoTarget:targetReducer
    }
})

export default store;

