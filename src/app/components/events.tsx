import axios from "axios"
import { DOMAttributes, DetailedHTMLProps, DragEventHandler, HTMLAttributes, RefObject, createRef, useEffect, useRef, useState } from "react"

type Props = {

}
export const Events = (props:Props) => {
    const [dragEventIndex,setDragEventIndex] = useState<number | null>(null);
    const [events,setEvents] = useState([]);
    const [dragElement,setDragElement] = useState<any>(null);
    const eventRefs = useRef<RefObject<HTMLTableRowElement>[]>([]);

    useEffect(() => {

        getGoogleCalendar();
    },[])

    const getGoogleCalendar = async() => {
        let timeMin:string = new Date().toISOString();
        try{
          let searchParams = new URLSearchParams();
          searchParams.set("timeMin",timeMin);
          const res = await axios.get(`/api/getGoogleCalendar?${searchParams}`);
          const data = res.data;
          setEvents(res.data);

          for(let i = 0,length=data.length; i < length; i++){
            eventRefs.current[i] = createRef<HTMLTableRowElement>();
          }

        } catch(error){
          console.error("Error Fetching data;",error);
        }
    }

    const dragStart = (e:React.DragEvent<HTMLTableRowElement>,index:number) => {
        setDragEventIndex(index);
        setDragElement(e);
    }

    const dragEnter = (index:number) => {
        if(index === dragEventIndex) return;
        if(dragEventIndex === null) return;
        let copyEvents = JSON.parse(JSON.stringify(events));
        let dragEvents = copyEvents[dragEventIndex];
        let indexEvents = copyEvents[index];
        copyEvents[dragEventIndex] = indexEvents;
        copyEvents[index] = dragEvents;
        setEvents(copyEvents);
        setDragEventIndex(index);
    }

    const dragOver = (e:React.DragEvent<HTMLTableRowElement>) => {
        e.preventDefault();
    }

    return(

        <div className="flex flex-wrap mt-3">

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th>id</th>
                        <th>ステータス</th>
                        <th>サマリー</th>
                        <th>イベントタイプ</th>
                        <th>開始日時</th>
                        <th>終了日時</th>
                    </tr>
                </thead>
            {
                events.map((event:any,index:number) => {
                    return(
                        <tr
                           key={index}
                           className="text-xs text-white uppercase bg-gray-400 dark:text-white"
                           draggable={true}
                           onDragStart={(e:React.DragEvent<HTMLTableRowElement>) => dragStart(e,index)}
                           onDragEnter={() => dragEnter(index)}
                           onDragOver={(e:React.DragEvent<HTMLTableRowElement>) => dragOver(e)}
                           ref={eventRefs.current[index]}
                        >
                            <td>{event.id}</td>
                            <td>{event.status}</td>
                            <td>{event.summary}</td>
                            <td>{event.eventType}</td>
                            <td>{event.startDate}</td>
                            <td>{event.endDate}</td>
                        </tr>
                    )
                })
            }
            </table>
        </div>
    )
}