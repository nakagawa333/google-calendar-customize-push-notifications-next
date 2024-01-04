type Props = {
    tasks:any
}

export const Tasks = (props:Props) => {
    return (
        <div className="flex flex-wrap mt-3">
            {
                props.tasks.map((task:any,index:number) => {
                    return (
                        <div key={index}>
                            <p>{task.title}</p>
                            <p>{task.due}</p>
                            <p>{task.updated}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}