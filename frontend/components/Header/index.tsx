import style from './header.module.css'

interface ITime{
    time: Date
    changeMonth: any
}

const Header = ({time, changeMonth}: ITime) =>{
    const monthsAbbreviations= ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

    const date= new Date(time)
    return <header className={"flexBox" + " " + style.header}>
        <button className={style.button + " " + style.left} onClick={(e) => changeMonth('previous')}></button>
        <h1 className={style.h1}>{ monthsAbbreviations[date.getMonth()] + " " + date.getFullYear()}</h1>
        <button className={style.button + " " + style.right} onClick={(e) => changeMonth('next')}></button>
    </header>
}

export default Header