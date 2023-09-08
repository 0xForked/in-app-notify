import React, {useEffect} from 'react';
import {Button} from "./components/ui/button";
import {AlertNotify} from "./components/alert-notify";
import {AlertDialogNotify} from "./components/alert-dialog-notify";
import {apiURL, NotifyType, publishNotifyEvent} from "./lib/api";
import {NotifyData} from "./models/notify";

function App() {
    const [
        openAlert,
        setOpenAlert,
    ] = React.useState<boolean>(false);
    const [
        openAlertDialog,
        setOpenAlertDialog,
    ] = React.useState<boolean>(false);

    const [
        alertData,
        setAlertData,
    ] = React.useState<NotifyData | null>(null);
    const [
        alertDialogData,
        setAlertDialogData,
    ] = React.useState<NotifyData | null>(null);

    let query = new URLSearchParams(window.location.search);
    let userId = query.get('user_id');
    const publishMessage = (type: NotifyType) => publishNotifyEvent(userId as string, type)

    useEffect(() => {
        if (typeof EventSource === "undefined") {
            console.log("Browser not support SSE")
            return
        }
        let source = new EventSource(`${apiURL}/${userId}`);
        source.onopen = (...args) => {
            console.log("on open", args);
        };
        source.onmessage = (event) => {
            console.log("notify event", event)

            const data  = JSON.parse(event.data)
            if (data.type === "ALERT") {
                setOpenAlert(false)
                setAlertData(data)
                setOpenAlert(true)
            }

            if (data.type === "MODAL") {
                setOpenAlertDialog(false)
                setAlertDialogData(data)
                setOpenAlertDialog(true)
            }
        };
        source.onerror = (_) =>  {
            console.log("An error occurred while attempting to connect.");
        };
        source.addEventListener("ping", (event) => {
            console.log("ping/keep-alive", event);
        });
        return () => {
            source.close();
        };
    }, [userId]);

    return (
        <main className="w-min-full h-min-full text-gray-700">
            <section className="flex flex-col items-center justify-center h-screen gap-2">
                <h1 className="text-3xl italic font-semibold">SSE</h1>
                <p className="text-lg">Notification sample</p>
                <div className="flex flex-row gap-2 mt-4">
                    <Button onClick={() => publishMessage(NotifyType.Message)}>
                        Fire Alert
                    </Button>
                    <Button onClick={ () => publishMessage(NotifyType.Orbit)}>
                        Fire Modal
                    </Button>
                </div>
            </section>
            <AlertNotify show={openAlert} payload={alertData} cb={setOpenAlert}/>
            <AlertDialogNotify show={openAlertDialog} payload={alertDialogData} cb={setOpenAlertDialog}/>
        </main>
  );
}

export default App;
