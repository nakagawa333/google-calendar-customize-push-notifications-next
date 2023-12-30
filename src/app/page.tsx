'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import FcmNotification from './components/FcmNotification'
import axios, { AxiosRequestConfig } from 'axios';
 
export default function Home() {
  const [count, setCount] = useState(0);
  const [calendars,setCalendars] = useState([]);
  const [events,setEvents] = useState([]);

  useEffect(() => {

    getGoogleCalendar();
  },[])

  const getGoogleCalendar = async() => {
    let timeMin:string = new Date().toISOString();
    try{
      let searchParams = new URLSearchParams();
      searchParams.set("timeMin",timeMin);
      const res = await axios.get(`/api/getGoogleCalendar?${searchParams}`);
      setEvents(res.data  .events);
    } catch(error){
      console.error("Error Fetching data;",error);
    }
  }


  return (
    <div>
      {
        events.map((event:any,index:number) => {
          return(
            <div key={index}>
              <p>{event.status}</p>
              <p>{event.summary}</p>
              <p>{event.eventType}</p>
              <p>{event.startDate}</p>
              <p>{event.endDate}</p>
            </div>
          )        
        })
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


