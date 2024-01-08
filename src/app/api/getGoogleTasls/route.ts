import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    //Google task取得処理
    let reqUrl:string = `https://script.google.com/macros/s/${process.env.NEXT_PUBLIC_GET_GOOGLE_TASKS_API_ID}/exec`;
    const res = await axios.get(reqUrl);
    let tasks = res.data?.tasks;

    return NextResponse.json(tasks);
}
