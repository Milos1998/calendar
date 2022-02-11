import { useEffect, useState } from "react"
import style from "./dateInMonth.module.css"
import TaskShortForm from "./TaskShortForm"
import { useDispatch } from 'react-redux' 
import { displayEmptyModal } from '../../store/slices/modalInfoSlice'
import { useRouter } from 'next/router'

interface IDateInMonth{
    time: Date,
    displayedMonth: number,
    todaysDate: number
}

interface ITask{
    title: string,
    time: number,
    description: string,
    participants: {
        _id: string,
        firstName: string,
        lastName: string
    }[]
}

const DateInMonth= ({time, displayedMonth, todaysDate}: IDateInMonth) => {
    const [tasks, setTasks]= useState<ITask[]>([])
    const dispatch= useDispatch()
    const router= useRouter()

    useEffect(() => {
        async function getMeetings(){
            try {
                let res= await fetch(`http://localhost:8000/meetings/${time.getTime()}`)
                if(!res.ok) throw res
                let newTasks= await res.json()
                setTasks(newTasks as ITask[])
            } catch (error) {
                console.error(error)
            }
        }
        getMeetings()
    }, [time])

    return <div 
            className={`${style.date} gridItem 
            ${todaysDate === time.getDate()  &&  displayedMonth === time.getMonth() ? style.today : ""}`}
            // onDoubleClick={() => {router.push({pathname: 'sastanak/[idSastanka]', query: {idSastanka: 1644606000000}})}}>
            onDoubleClick={() => {router.push({pathname: 'dates/[dateId]', query: {dateId: time.getTime()}})}}>

        <h3 className={style.h3}>{time.getDate()}</h3>
        <h3 className={`${style.plus}`} onClick={() => dispatch(displayEmptyModal(time.getTime()))}>+</h3>
        {tasks.sort((a, b) => a.time-b.time).slice(0, 2).map(task => {
            return <TaskShortForm
                key={task.time}
                title={task.title}
                time={new Date(task.time)}
                participants={task.participants.map(par => {
                    return {
                        value: par._id,
                        label: par.firstName + ' ' + par.lastName
                    }
                })}
                description={task.description}/>
        })}
        {tasks.length > 2  &&  <div className={style.dots}></div>}
        <div className={displayedMonth === time.getMonth() ? "" : style.notCurrent }></div>
    </div>
}


export default DateInMonth