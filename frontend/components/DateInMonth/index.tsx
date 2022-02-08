import style from "./dateInMonth.module.css"
import Task from "./Task"

interface IDateInMonth{
    time: Date
}

const DateInMonth= ({time}: IDateInMonth) => {
    return <div className={style.date + " " + "gridItem"}>
        <h3>{time.getDate()}</h3>
        <Task />        
    </div>
}


export default DateInMonth