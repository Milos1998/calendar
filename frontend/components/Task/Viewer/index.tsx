import { URL } from '../../../constants'
import style from './viewer.module.css'

interface IViewer{
    title: string,
    description: string,
    time: number,
    participants: string[]
    setMode: any,
    onAction: any,
    onCancel: any
}

const Viewer= ({title, description, time, participants, setMode, onAction, onCancel}:IViewer) =>{
    function formatTime() {
        let fullDate= new Date(time)

        let hhmm= ''
        if(fullDate.getHours() < 10) hhmm+= '0'
        hhmm+= fullDate.getHours() + ":"
        if(fullDate.getMinutes() < 10) hhmm+= '0'
        hhmm+= fullDate.getMinutes()

        return `${fullDate.getDate()}-${fullDate.getMonth()+1}-${fullDate.getFullYear()} ${hhmm}`
    }

    async function deleteTask(){
        try {
            let res= await fetch (URL + `/meetings/${time}`, {
                method: "DELETE"
            })
    
            if(!res.ok) throw res
        } catch (error) {
            console.error(error)
        }
        onAction()
    }

    return <div className={`${style.display} `}>
        <h3 className={`${style.displayItem}`} >{title}</h3>
        <p className={`${style.displayItem}`}>{description}</p>
        <p className={`${style.displayItem}`}>Meeting time: {formatTime()}</p>
        {!!participants.length  &&  <p className={`${style.displayItem}`}>
            Participant(s): 
            {participants.map((participant, index) => <span key={index}><br />{participant}</span>)}
        </p>}

        <div className={`${style.buttonsContainer} ${style.displayItem}`}>
            <button onClick={e => {setMode('edit')}} className={`${style.edit} ${style.button} ${style.displayItem}`}>Edit</button>
            <button onClick={e => {deleteTask()}} className={`${style.delete} ${style.button} ${style.displayItem}`}>Delete</button>
        </div>
    </div>
}

export default Viewer