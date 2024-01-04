import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server'

import {google, calendar_v3} from 'googleapis'
import axios from 'axios';

const SCOPES:string = 'https://www.googleapis.com/auth/calendar';
const GOOGLE_PRIVATE_KEY:string = process.env.NEXT_PUBLIC_PRIVATE_KEY? process.env.NEXT_PUBLIC_PRIVATE_KEY.replace(/\\n/g, '\n') :"";
const GOOGLE_CLIENT_EMAIL:string = process.env.NEXT_PUBLIC_CLIENT_EMAIL? process.env.NEXT_PUBLIC_CLIENT_EMAIL : "";
const GOOGLE_PROJECT_NUMBER:string = process.env.NEXT_PUBLIC_GOOGLE_PROJECT_NUMBER ? process.env.NEXT_PUBLIC_GOOGLE_PROJECT_NUMBER : "";
const GOOGLE_CALENDAR_ID:string = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID ? process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID : "";

let calendar:calendar_v3.Calendar = google.calendar({ version: 'v3'});

export async function GET(request: NextRequest){
    const searchParams:URLSearchParams = request.nextUrl.searchParams;
    let timeMin:any = searchParams.get("timeMin");
    let calendar:calendar_v3.Calendar | undefined = googleCalendarAuth();

    let methodOptions = {
        calendarId: GOOGLE_CALENDAR_ID,
        timeMin:timeMin,
        maxResults: 250,
        singleEvents: false,
        orderBy: 'updated'
    }
    let events;

    try{
        events = await calendar.events.list(methodOptions);
    } catch(error:any){
        console.error(error)
    }
    let eventItems:EventTypes[] = [];
    if(events?.data?.items){
        for(let event of events.data.items){
            let startDate:string = "";
            let endDate:string = "";
            //日時指定なし
            if(event.start?.date){
                startDate = event.start?.date
            }

            if(event.end?.date){
                endDate = event.end?.date
            }

            if(event.start?.dateTime){
                startDate = event.start?.dateTime
            }

            if(event.end?.dateTime){
                endDate = event.end?.dateTime
            }

            eventItems.push({
                status:event.status,
                summary:event.summary,
                eventType:event.eventType,
                startDate:startDate,
                endDate:endDate
            });
        }
    }

    //Google task取得処理
    let reqUrl:string = `https://script.google.com/macros/s/${process.env.NEXT_PUBLIC_GET_GOOGLE_TASKS_API_ID}/exec`;
    const res = await axios.get(reqUrl);
    let tasks = res.data?.tasks;

    let response = {
        "events":eventItems,
        "tasks":tasks
    }

    //TODO 取得したタスクIDから、タスクを取得

    return NextResponse.json(response);
}

/**
 * Googleカレンダーの認証を行う
 */
const googleCalendarAuth = () => {

    let calendar:calendar_v3.Calendar;
    try{
        const jwtClient = new google.auth.JWT(
            GOOGLE_CLIENT_EMAIL,
            undefined,
            GOOGLE_PRIVATE_KEY,
            SCOPES);
        calendar = google.calendar({
            version: 'v3',
            auth: jwtClient
        });

    } catch(error:any){
        console.error(error.message,error);
        console.error("Google認証に失敗しました");
        throw new Error("Google認証に失敗しました");
    }

    return calendar;
}