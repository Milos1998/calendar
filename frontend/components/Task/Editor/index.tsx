import { useState, useEffect } from 'react'
import style from './editor.module.css'
import { DATE_REGEX } from '../../../constants'
import { MultiSelect } from 'react-multi-select-component'
import { SetStateAction, Dispatch } from 'react'
import { URL } from '../../../constants'

interface IParticipant{
    value: string,
    label: string
}

interface IMeetingData{
    title: string,
    description: string,
    participants: string[],
    newId?: number
}

interface IEditor{
    titleState: {
        title: string,
        setTitle: Dispatch<SetStateAction<string>>
    },
    descriptionState: {
        description: string,
        setDescription: Dispatch<SetStateAction<string>>
    },
    time: number,
    participantsState: {
        participants: IParticipant[],
        setParticipants: Dispatch<SetStateAction<IParticipant[]>>
    },
    onAction: any,
    onCancel: any,
    editorMode: 'new' | 'edit'
}

const Editor= ({titleState, descriptionState, time, participantsState, onAction, onCancel, editorMode}: IEditor) => {
    const {title, setTitle}= titleState
    const {description, setDescription}= descriptionState
    const [inputTime, setInputTime]= useState(formatTime())
    const {participants, setParticipants}= participantsState
    const [allParticipants, setAllParticipants]= useState<IParticipant[]>([])

    function formatTime() {
        let fullDate= new Date(time)

        let hhmm= ''
        if(fullDate.getHours() < 10) hhmm+= '0'
        hhmm+= fullDate.getHours() + ":"
        if(fullDate.getMinutes() < 10) hhmm+= '0'
        hhmm+= fullDate.getMinutes()

        return `${fullDate.getDate()}-${fullDate.getMonth()+1}-${fullDate.getFullYear()} ${hhmm}`
    }

    function validateTitle(){
        return !!title
    }

    function validateDate() {
        return DATE_REGEX.test(inputTime)
    }

    useEffect(() => {
        async function getPatricipants(){
            let newParticipants: any[]= []
            try {
                let res= await fetch(URL + "/participants")
                if(!res.ok) throw res
                newParticipants= await res.json()
                setAllParticipants(newParticipants.map(participant => ({
                    label: participant.firstName + " " + participant.lastName,
                    value: participant._id
                })) as IParticipant[])
            } catch (error) {
                console.error(error)
            }
        }
        getPatricipants()
    }, [])

    function parseTime(){
        const date= ((inputTime.match(/(\d{1,2})-/) as any)[1]) as number
        const month= (inputTime.match(/-(\d{1,2})-/) as any)[1] as number
        const year= (inputTime.match(/\d\d\d\d/) as any)[0] as number
        const hours= (inputTime.match(/(\d{1,2}):/) as any)[1] as number
        const minutes= (inputTime.match(/:(\d{1,2})/) as any)[1] as number

        return new Date(year, month - 1, date, hours, minutes).getTime()

    }

    async function submitMeeting(){
        let method= editorMode === 'new' ? 'POST' : 'PUT'

        let meetingData: IMeetingData= {
            title: title,
            description: description,
            participants: participants.map(participant => participant.value)
        }
        let meetingId: number

        if(method === 'POST'){
            meetingId= parseTime()
        }
        else{
            meetingId= time
            meetingData.newId= parseTime()
        }

        try {
            let res= await fetch(URL + `/meetings/${meetingId}`,{
                method: method,
                body: JSON.stringify(meetingData),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            
            if(!res.ok) throw res
        } catch (error) {
            alert('Something went wrong, try again later :/')
            console.error(error)
        }
        onAction()
    }



    return <div
    className={style.form}
    >
        <input
            type="text"
            placeholder="Add title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={`${validateTitle() ? '' : style.missingField} ${style.textInput} ${style.formItem}`}
        />

        <textarea
            className={`${style.textInput} ${style.formItem}`}
            placeholder="Add description"
            value={description}
            onChange={e => setDescription(e.target.value)}>
        </textarea>

        <label className={`${style.formItem}`}>Add participants</label>
        <MultiSelect
            className= {`${style.formItem}`}
            options= {allParticipants}
            value= {participants}
            onChange= {setParticipants}
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

        <div className={`${style.formItem} ${style.buttonsContainer}`}>
            <button onClick= {e => {
                if(validateTitle()  &&  validateDate()){
                    submitMeeting()
                }
            }}
                className={`${style.button} ${style.submit} ${style.formItem}`}
            >Save</button>
            <button onClick={e => {onCancel()}} className={`${style.button} ${style.cancel} ${style.formItem}`} >Cancel</button>
        </div>
    </div>
}

export default Editor
