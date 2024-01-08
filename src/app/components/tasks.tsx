import axios from "axios";
import { indexing_v3 } from "googleapis";
import { useEffect, useState } from "react";

type Props = {

}

export const Tasks = (props:Props) => {
    const limit:number = 10;
    const [dragTaskIndex,setDragTaskIndex] = useState<number | null>(null);
    const [tasks,setTasks] = useState<any>([]);
    const [page,setPage] = useState<number>(1);
    const [tasksMap,setTasksMap] = useState<Map<number,any[]>>(new Map());
    const [taskPagenation,setTaskPagenation] = useState<number[]>([]);

    useEffect(() => {
        getGoogleTasks();
    },[])

    /**
     * Googleタスク一覧を取得する
     */
    const getGoogleTasks = async() => {
        const res = await axios.get(`/api/getGoogleTasls`);
        const data = res.data;
        setTasks(data);
        let tasksMapSize = sliceArray(data,limit);

        let taskPagenation:number[] = [];
        for(let i = 1; i <= tasksMapSize; i++){
            taskPagenation.push(i);
        }
        setTaskPagenation(taskPagenation);
    }

    /**
     * ドラッグスタート時イベント
     * @param index インデックス
     */
    const dragStart = (index:number) => {
        setDragTaskIndex(index);
    }

    /**
     * ドラッグエンター時イベント
     * @param index インデックス
     */
    const dragEnter = (index:number) => {
        //TODO Drag＆Dropで要素を移動できない不具合の改修
        if(index === dragTaskIndex) return;
        if(dragTaskIndex === null) return;
        let copyTasks = JSON.parse(JSON.stringify(tasksMap.get(page)));
        let dragTasks = copyTasks[dragTaskIndex];
        let indexTasks = copyTasks[index];
        copyTasks[dragTaskIndex] = indexTasks;
        copyTasks[index] = dragTasks;
        let map = new Map(tasksMap);
        // setTasks(copyTasks);
        setTasksMap(map);
        setDragTaskIndex(index);
    }

    /**
     * ドラッグオーバー時イベント
     * @param e イベント
     */
    const dragOver = (e:any) => {
        e.preventDefault();
    }

    const sliceArray = (data:any[],limit:number) => {
        let map = new Map();
        for(let i = 0,length=Math.ceil(data.length / limit); i < length; i++){
            let slice = data.slice(i * limit,(i + 1) * limit);
            map.set(i + 1,slice)
        }
        setTasksMap(map);
        return map.size;
    }

    const pageClick = (page:number) => {
        if(page < 1 || tasksMap.size < page) return;
        setPage(page)
    }

    return (
        <div className="flex flex-wrap mt-3">

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th>id</th>
                    <th>タイトル</th>
                    <th>タスクの期限</th>
                    <th>最終更新日時</th>
                </tr>
            </thead>
            {
                tasksMap.size !== 0 && tasksMap.get(page)?.map((task:any,index:number) => {
                    return (
                        <tr
                            key={index}
                            className="text-xs text-white uppercase bg-gray-400 dark:text-white"
                            draggable={true}
                            onDragStart={() => dragStart(index)}
                            onDragEnter={() => dragEnter(index)}
                            onDragOver={(e:any) => dragOver(e)}
                        >
                            <td>{task.id}</td>
                            <td>{task.title}</td>
                            <td>{task.due}</td>
                            <td>{task.updated}</td>
                        </tr>
                    )
                })
            }

            {
                taskPagenation.length !== 0 ? (
                    <nav aria-label="Page navigation example">
                        <ul className="inline-flex -space-x-px text-sm">
                            <li onClick={() => pageClick(page - 1)}>
                                <a className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"/>
                                    </svg>
                                </a>
                            </li>
                            {
                                taskPagenation.map((page:number) => {
                                    return(
                                        <li onClick={() => pageClick(page)}>
                                            <a className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                                {page}
                                            </a>
                                        </li>
                                    )
                                })
                            }
                            <li onClick={() => pageClick(page + 1)}>
                                <a className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </nav>
                ) : (
                    <></>
                )
            }

        </table>
        </div>
    )
}