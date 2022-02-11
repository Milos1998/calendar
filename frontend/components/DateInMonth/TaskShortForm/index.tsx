import style from './taskShortForm.module.css'
import { useDispatch } from 'react-redux'
import { displayModal } from '../../../store/slices/modalInfoSlice'

interface ITask{
    title: string,
    time: Date
    participants: IParticipant[],
    description: string
}

interface IParticipant{
    value: string,
    label: string
}

const TaskShortForm= ({title, time, participants, description}: ITask) => {
    const dispatch= useDispatch()

    function displayFormatedTime(time: Date): string{
        let res= ''
        if(time.getHours() < 10) res+= '0'
        res+= time.getHours()
        res+= ':'
        if(time.getMinutes() < 10) res+= '0'
        res+= time.getMinutes()

        return res
    }
    
    return <div className={style.task} onClick={e => {
        dispatch(displayModal({
            displayed: true,
            taskMode: 'view',
            taskData: {
                time: time.getTime(),
                description: description,
                title: title,
                participants: participants
            }
        }))
    }}>
        <h4 className={style.h4}>{title}</h4>
        <span>{displayFormatedTime(time)}</span>
    </div>
}

export default TaskShortForm