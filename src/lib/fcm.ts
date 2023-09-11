import {initializeApp} from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import {Dispatch, SetStateAction} from "react";

// don't worry the service has been terminated
const firebaseApp = initializeApp({
    apiKey: "AIzaSyAQg2f4XhRIfSNnGCOWRLdeixOSl2QRVzo",
    authDomain: "fookipoke-studio.firebaseapp.com",
    projectId: "fookipoke-studio",
    storageBucket: "fookipoke-studio.appspot.com",
    messagingSenderId: "991369191835",
    appId: "1:991369191835:web:f6be06ae8458cec2a4c13e"
});
getAnalytics(firebaseApp);
const messaging = getMessaging(firebaseApp);

export const requestPermission = (setFCMToken: Dispatch<SetStateAction<String | null>>) => {
    console.log("Requesting User Permission......");
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            console.log("Notification User Permission Granted.");
            return getToken(messaging, { vapidKey: "BGU9WQQY5A9FHYMiipByU0hrma-TjJl45u6bnwDnnOHjBgA9BW7dqWn_Aqgyow16-9oUyK6q23ut3JJyoWQkadI" })
                .then((currentToken) => {
                    if (currentToken) {
                        console.log('Client Token: ', currentToken);
                        setFCMToken(currentToken)
                    } else {
                        console.log('Failed to generate the app registration token.');
                    }
                })
                .catch((err) => {
                    console.log('An error occurred when requesting to receive the token.', err);
                });
        } else {
            console.log("User Permission Denied.");
        }
    });
}

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
