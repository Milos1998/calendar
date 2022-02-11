import Task from "../Task"
import { IModalInfo } from "../../store/slices/modalInfoSlice"
import { useSelector, RootStateOrAny } from 'react-redux'
import { useDispatch } from "react-redux"
import { hideModal } from "../../store/slices/modalInfoSlice"
import style from './modal.module.css'

const Modal= ({onAction}: any) => {
    const modalInfo= useSelector((state: RootStateOrAny) => state.modalInfo) as IModalInfo
    const dispatch= useDispatch()

    return <>
        {modalInfo.displayed  &&  
            <div onClick={e => {if (e.currentTarget === e.target) dispatch(hideModal())}}
                className={`${style.modal}`}>
                <Task   onAction={() => {
                        dispatch(hideModal())
                        onAction()
                    }}
                    onCancel= {() => dispatch(hideModal())}
                    taskData={modalInfo.taskData}
                    taskMode={modalInfo.taskMode}/>
        </div>}
    </>
}

export default Modal