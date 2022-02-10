import { configureStore } from "@reduxjs/toolkit"
import modalInfoReducer from "./slices/modalInfoSlice"

export default configureStore({
    reducer: {
        modalInfo: modalInfoReducer
    },
})