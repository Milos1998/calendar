import { useEffect, useState } from "react"
import style from "./dateInMonth.module.css"
import Task from "./Task"
import { useDispatch } from 'react-redux' 
import { displayModal } from '../../store/slices/modalInfoSlice'

interface IDateInMonth{
    time: Date,
    displayedMonth: number,
    todaysDate: number
}

interface ITask{
    title: string,
    time: number,
}

const DateInMonth= ({time, displayedMonth, todaysDate}: IDateInMonth) => {
    const [tasks, setTasks]= useState<ITask[]>([])
    const dispatch= useDispatch()

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
            onClick={() => dispatch(displayModal(time.getTime()))}>

        <h3 className={style.h3}>{time.getDate()}</h3>
        {tasks.sort((a, b) => a.time-b.time).slice(0, 2).map(task => {
            return <Task key={task.time} title={task.title} time={new Date(task.time)}/>
        })}
        {tasks.length > 2  &&  <div className={style.dots}></div>}
        <div className={displayedMonth === time.getMonth() ? "" : style.notCurrent }></div>
    </div>
}


export default DateInMonth