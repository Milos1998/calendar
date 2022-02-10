import style from './task.module.css'

interface ITask{
    title: string,
    time: Date
}

const Task= ({title, time}: ITask) => {
    function displayFormatedTime(time: Date): string{
        let res= ''
        if(time.getHours() < 10) res+= '0'
        res+= time.getHours()
        res+= ':'
        if(time.getMinutes() < 10) res+= '0'
        res+= time.getMinutes()

        return res
    }
    
    return <div className={style.task}>
        <h4 className={style.h4}>{title}</h4>
        <span>{displayFormatedTime(time)}</span>
    </div>
}

export default Task