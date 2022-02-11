import { useState } from 'react'
import Viewer from './Viewer'
import Editor from './Editor'

export interface ITask{
    taskMode: 'view' | 'edit' | 'new'
    taskData: {
        title: string
        time: number,
        description: string,
        participants: IParticipant[]
    }
}

interface ITaskPayload extends ITask{
    onAction: any,
    onCancle?: any
}

interface IParticipant{
    value: string,
    label: string
}

const Task= ({onAction, onCancle, taskMode, taskData}: ITaskPayload) => {
    const [title, setTitle]= useState(taskData.title)
    const [time, setTime]= useState(taskData.time)
    const [description, setDescription]= useState(taskData.description)
    const [participants, setParticipants]= useState(taskData.participants)
    const [mode, setMode]= useState(taskMode)


    return <>
        {mode === 'view' ? 
            <Viewer title={title}
                    time={time}
                    description={description}
                    participants={participants.map(participant => participant.label)}
                    setMode={setMode}
                    onAction= {onAction}
                    onCancel={undefined}/> :
            <Editor titleState={{title, setTitle}}
                    descriptionState={{description, setDescription}}
                    time={time}
                    participantsState={{participants, setParticipants}}
                    onAction= {onAction}
                    onCancle= {onCancle}
                    editorMode={mode as 'new' | 'edit'}/>
        }
    </> 
}

export default Task