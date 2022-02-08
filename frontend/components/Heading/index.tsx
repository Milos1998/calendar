import style from './heading.module.css'

const Heading= () => {
    const dayAbbreviations= ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    return <>
        {dayAbbreviations.map((day, index) => (
        <h2 className={style.h2 + " " + "gridItem"} key={index}>{day}</h2>
        ))}
    </>
}

export default Heading