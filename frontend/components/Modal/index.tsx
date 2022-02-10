import { useEffect, useState } from "react"
import { MultiSelect } from "react-multi-select-component"
import { URL } from '../../constants'
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux'
import { DATE_REGEX } from '../../constants'
import { hideModal } from '../../store/slices/modalInfoSlice'
import style from './modal.module.css'

interface IParticipant{
    value: string,
    label: string
}

interface IModalInfo{
    displayed: boolean,
    time: Date
}

const Modal= ({updateDates}: any) => {
    const [participants, setParticipants]= useState<IParticipant[]>([])
    const [selectedParticipants, setSelectedParticipants]= useState<IParticipant[]>([])
    const modalInfo= useSelector((state: RootStateOrAny) => state.modalInfo) as IModalInfo
    const [inputTitle, setInputTitle]= useState('')
    const [inputDescription, setInputDescription]= useState('')
    const [inputTime, setInputTime]= useState('')
    const dispatch= useDispatch()

    function validateTitle(){
        return !!inputTitle
    }

    function validateDate() {
        return DATE_REGEX.test(inputTime)
    }

    async function submitMeeting(){
        //bad practice, I know
        const date= ((inputTime.match(/(\d{1,2})-/) as any)[1]) as number
        const month= (inputTime.match(/-(\d{1,2})-/) as any)[1] as number
        const year= (inputTime.match(/\d\d\d\d/) as any)[0] as number
        const hours= (inputTime.match(/(\d{1,2}):/) as any)[1] as number
        const minutes= (inputTime.match(/:(\d{1,2})/) as any)[1] as number

        const meetingTime= new Date(year, month - 1, date, hours, minutes).getTime()

        const meetingData={
            title: inputTitle,
            description: inputDescription,
            participants: selectedParticipants.map(participant => participant.value)
        }

        let req= await fetch(URL + `/meetings/${meetingTime}`,{
            method: 'POST',
            body: JSON.stringify(meetingData),
            headers: {
                'Content-Type': 'application/json'
            },
        })

        if(!req.ok) {
            console.error(req)
            alert('Oops, something went wrong!')
        }
        updateDates()
    }

    useEffect(() => {
        async function getPatricipants(){
            let newParticipants: any[]= []
            try {
                let res= await fetch(URL + "/participants")
                if(!res.ok) throw res
                newParticipants= await res.json()
                setParticipants(newParticipants.map(participant => ({
                    label: participant.firstName + " " + participant.lastName,
                    value: participant._id
                })) as IParticipant[])
            } catch (error) {
                console.error(error)
            }
        }
        getPatricipants()
        setInputTime(`${new Date(modalInfo.time).getDate()}-${new Date(modalInfo.time).getMonth()+1}-${new Date(modalInfo.time).getFullYear()} 00:00`)
        setInputTitle('')
        setInputDescription('')
        setSelectedParticipants([])
    }, [modalInfo])

    return <div
                className={`modalOverlay ${modalInfo.displayed ? style.displayed : style.hidden}`}
                onClick={e => e.target === e.currentTarget  &&  dispatch(hideModal())
            }>

        <form
            onSubmit={e => {
                e.preventDefault()
                if(validateTitle()  &&  validateDate()){
                    submitMeeting()
                    dispatch(hideModal())
                }
            }}
            className={style.form}
        >
            <input
                type="text"
                placeholder="Add title"
                value={inputTitle}
                onChange={e => setInputTitle(e.target.value)}
                className={`${validateTitle() ? '' : style.missingField} ${style.textInput} ${style.formItem}`}
            />

            <textarea
                className={`${style.textInput} ${style.formItem}`}
                placeholder="Add description"
                value={inputDescription}
                onChange={e => setInputDescription(e.target.value)}>
            </textarea>
            
            <label className={`${style.formItem}`}>Add participants</label>
            <MultiSelect
                className={`${style.formItem}`}
                options= {participants}
                value= {selectedParticipants}
                onChange= {setSelectedParticipants}
                labelledBy="Select"
            />

            <label className={`${style.formItem}`} htmlFor="time">Input meeting time (dd-mm-yyyy hh:mm):</label>
            <input
                type="text"
                name="time"
                value={inputTime}
                onChange={e => setInputTime(e.target.value)}
                className={`${validateDate() ? '' : style.missingField} ${style.textInput} ${style.formItem}`}
            />

            <input
                className={`${style.formItem} ${style.button} ${style.submit}`}
                type="submit"
                value="Add"
            />
            <button className={`${style.formItem} ${style.button} ${style.cancel}`} onClick={e => dispatch(hideModal())}>Cancel</button>
        </form>
    </div>
}

export default Modal