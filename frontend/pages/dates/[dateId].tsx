import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Task from '../../components/Task'
import { ITask } from '../../components/Task'
import { URL } from '../../constants'

interface ITaskNotParsed{
    title: string,
    time: number,
    description: string,
    participants: {
        _id: string,
        firstName: string,
        lastName: string
    }[]
}

const DetailedDateDisplay= () => {
    const [tasks, setTasks]= useState<ITask[]>([])
    const router= useRouter()
    const { dateId }= router.query
    const id= Number.parseInt(dateId as string)
    const [rerender, setRerender]= useState(false)
 

    useEffect(() => {
        async function getMeetings(){
            try {
                let res= await fetch(`${URL}/meetings/${id}`)
                if(!res.ok) throw res
                let newTask= ((await res.json()) as ITaskNotParsed[])
                
                setTasks(newTask.map(task => ({
                    taskMode: 'view',
                    taskData:{
                        title: task.title,
                        time: task.time,
                        description: task.description,
                        participants: task.participants.map(par => ({value: par._id, label: par.firstName + " " + par.lastName}))
                    }
                })))
            } catch (error) {
                console.error(error)
            }
        }
        getMeetings()
    }, [])

    return <div className="dateDetailedDisplay">
        <div className="dateDetailedDisplayHeading">
            <button className="backButton" onClick={e => {router.back()}}></button>
            <h3>Meetings for {`${new Date(id).getDate()}-${new Date(id).getMonth()+1}-${new Date(id).getFullYear()}`}</h3>
        </div>

    {
        tasks.map(task => (
            <Task 
                taskMode={task.taskMode}
                taskData={task.taskData}
                onAction={() => {setRerender(!rerender)}}
                onCancel={() => {}}
                key={task.taskData.time}
            />
        ))
    }
    </div>
}

export default DetailedDateDisplay
