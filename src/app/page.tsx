'use client'
import { useEffect, useState } from 'react'
import FcmNotification from './components/fcmNotification'
import axios, { AxiosRequestConfig } from 'axios';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Events } from './components/events';
import { Tasks } from './components/tasks';

export default function Home() {
  const [count, setCount] = useState<number>(0);
  const [calendars,setCalendars] = useState([]);
  const [events,setEvents] = useState([]);
  const [tasks,setTasks] = useState([]);
  //0:イベント 1:タスク
  const [selectType,setSelectType] = useState<number>(0);


  useEffect(() => {

    getGoogleCalendar();
  },[])

  const getGoogleCalendar = async() => {
    let timeMin:string = new Date().toISOString();
    try{
      let searchParams = new URLSearchParams();
      searchParams.set("timeMin",timeMin);
      const res = await axios.get(`/api/getGoogleCalendar?${searchParams}`);
      setEvents(res.data.events);
      setTasks(res.data.tasks);

    } catch(error){
      console.error("Error Fetching data;",error);
    }
  }

  const selectTypeClick = (selectType:number) => {
    setSelectType(selectType);
  }

  return (
    <div className="container m-auto">

      <div className="flex flex-wrap mt-3">
        <div className="flex items-center me-4">
          <input
            checked={selectType === 0 ? true : false}
            id="red-radio"
            type="radio" value=""
            name="colored-radio"
            className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            onClick={() => selectTypeClick(0)}
            />
          <label className="ms-2 text-sm font-medium text-black-900 dark:text-black-300">イベント</label>
        </div>
        <div className="flex items-center me-4">
          <input
            checked={selectType === 1 ? true : false}
            id="red-radio"
            type="radio"
            value=""
            name="colored-radio"
            className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            onClick={() => selectTypeClick(1)}
            />
          <label className="ms-2 text-sm font-medium text-black-900 dark:text-black-300">タスク</label>
        </div>
      </div>
        {
          selectType === 0 ? (
            <Events events={events} />
          ) : selectType === 1 ? (
            <Tasks tasks={tasks} />
          ) : (
            <></>
          )
        }
      <FcmNotification />
    </div>
  )
}

// export async function getStaticProps(){
//   try{
//     const res = await fetch("")
//   } catch(error){

//   }
// }


