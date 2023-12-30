// Import the functions you need from the SDKs you need
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey:process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
    authDomain:process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
    projectId:process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
    storageBucket:process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
    messagingSenderId:process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
    appId:process.env.NEXT_PUBLIC_FIREBASE_APPID,
    measurementId:process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
const analytics = getAnalytics(firebaseApp);

/**
 * FCMのリクエストトークンを発行する
 * @returns トークン
 */
export const getRequestToken = async():Promise<string> => {
    let vapidKey:string | undefined = process.env.NEXT_PUBLIC_FIREBASE_VAPIDKEY;
    if(vapidKey === undefined){
        throw new Error("vapidKeyを取得できませんでした");
    }

    let notificationPermission:NotificationPermission = await Notification.requestPermission();
    
    if(notificationPermission === "granted"){
        let token = await getToken(messaging,{"vapidKey":vapidKey});
        return token;
    }
    return "";
}

export const onMessageListener = () =>
   new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
})
