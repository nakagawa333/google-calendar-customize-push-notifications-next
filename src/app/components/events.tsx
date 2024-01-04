
type Props = {
    events:any
}
export const Events = (props:Props) => {
    return(

        <div className="flex flex-wrap mt-3">
            {
                props.events.map((event:any,index:number) => {
                    return(
                        <tr key={index} className="text-xs text-white uppercase bg-gray-400 dark:text-white">
                            <td>{event.status}</td>
                            <td>{event.summary}</td>
                            <td>{event.eventType}</td>
                            <td>{event.startDate}</td>
                            <td>{event.endDate}</td>
                        </tr>
                    )
                })
            }
        </div>
    )
}