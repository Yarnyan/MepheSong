import { configureStore } from "@reduxjs/toolkit";
import currencyReducer from "../reducers/reducers";

const store = configureStore({
    reducer: currencyReducer
})

export default store