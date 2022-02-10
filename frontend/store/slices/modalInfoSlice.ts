import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState= {
    displayed: false,
    time: 0
}

export const modalInfoSlice= createSlice({
    name: 'modalInfo',
    initialState,
    reducers: {
        displayModal: (state, action: PayloadAction<number>) => {
            state.displayed= true
            state.time= action.payload
        },
        hideModal: (state) => {
            state.displayed= false
        }
    }
})

export const { displayModal, hideModal }= modalInfoSlice.actions

export default modalInfoSlice.reducer