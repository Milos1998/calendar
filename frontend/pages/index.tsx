import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import Header from '../components/Header'
import Heading from '../components/Heading'
import DateInMonth from '../components/DateInMonth'

function calculateDatesInMonth(time: Date){
    let numOfWeeks= 5
    let numOfDaysInMonth= new Date(time.getFullYear(), time.getMonth()+1, 0).getDate()    

    let firstOfCurrentMonth= new Date(time.getFullYear(), time.getMonth(), 1)
    let dayOfWeek= firstOfCurrentMonth.getDay() === 0 ? 7 : firstOfCurrentMonth.getDay()    //because days are 0 indexed starting from SUN for some reason
    //if february starts on monday than we need only 4 weeks in calendar
    if(numOfDaysInMonth % 7 === 0  &&  dayOfWeek === 1)  numOfWeeks--
    //month has 31 days and starts at least on saturday
    else if(numOfDaysInMonth % 7 === 3  &&  dayOfWeek > 5) numOfWeeks++
    //month has 30 days and starts on sunday
    else if(numOfDaysInMonth % 7 === 2  &&  dayOfWeek === 7) numOfWeeks++
    
    firstOfCurrentMonth.setDate(firstOfCurrentMonth.getDate() - (dayOfWeek - 1))
    let currentDate= firstOfCurrentMonth

    let dates= []
    for (let i= 0; i < numOfWeeks*7; i++){
      dates.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates
}

const Home: NextPage = () => {
  const [time, useTime]= useState(new Date)
  const [datesInMonth, useDatesInMonth]= useState(calculateDatesInMonth(time))

  function useChangeMonth(changeTo: string){
    let newTime= new Date(time)
    if(changeTo === 'previous'){ newTime.setMonth(newTime.getMonth() - 1) }
    if(changeTo === 'next'){ newTime.setMonth(newTime.getMonth() + 1) }
    useTime(newTime)
    useDatesInMonth(calculateDatesInMonth(newTime))
  }

  return (
    <div>
      <Head>
        <title>Calendar</title>
        <link rel="icon" href="/favicon.ico?v=2" />
      </Head>

      <Header time={time} changeMonth={useChangeMonth}/>

      <div className={"grid"}>
      <Heading />
        {datesInMonth.map((date, index) => <DateInMonth key={index} time={date}/>)}
      </div>

    </div>
  )
}

export default Home
