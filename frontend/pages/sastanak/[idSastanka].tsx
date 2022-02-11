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

const Meeting= () => {
    const [tasks, setTasks]= useState<ITask[]>([])
    const router= useRouter()
    const { idSastanka }= router.query
    const id= Number.parseInt(idSastanka as string)
    const [rerender, setRerender]= useState(false)
 

    useEffect(() => {
        async function getMeetings(){
            try {
                let res= await fetch(`${URL}/meetings/${id}`)
                if(!res.ok) throw res
                let newTask= ((await res.json()) as ITaskNotParsed[])
                let parsedTask= newTask.map(task => ({
                    taskMode: 'view',
                    taskData:{
                        title: task.title,
                        time: task.time,
                        description: task.description,
                        participants: task.participants.map(par => ({value: par._id, label: par.firstName + " " + par.lastName}))
                    }
                })).filter(task => task.taskData.time === id) as ITask[]
                
                setTasks(parsedTask)
            } catch (error) {
                console.error(error)
            }
        }
        getMeetings()
    }, [])

    return <div className="dateDetailedDisplay">
            <button className="backButton" onClick={e => {router.back()}}></button>
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

export default Meeting