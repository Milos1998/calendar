import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITask } from '../../components/Task'

export interface IModalInfo extends ITask{
    displayed: boolean,
}

const initialState: IModalInfo= {
    displayed: false,
    taskMode: 'new',
    taskData: {
        title: '',
        time: 0,
        description: '',
        participants: []
    }
}

export const modalInfoSlice= createSlice({
    name: 'modalInfo',
    initialState,
    reducers: {
        displayEmptyModal: (state, action: PayloadAction<number>) => {
            state.taskData= {
                title: '',
                description: '',
                participants: [],
                time: action.payload
            }
            state.taskMode= 'new'
            state.displayed= true
        },
        displayModal: (state, action: PayloadAction<IModalInfo>) => {
            state.displayed= action.payload.displayed
            state.taskData= {... action.payload.taskData}
            state.taskMode= action.payload.taskMode
        },
        hideModal: (state) => {
            state.displayed= false
        }
    }
})

export const { displayEmptyModal, displayModal, hideModal }= modalInfoSlice.actions

export default modalInfoSlice.reducer