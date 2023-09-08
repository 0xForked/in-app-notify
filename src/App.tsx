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

    const userId: string = "65b38384-a192-4474-81e6-fc429a309e0c"

    const publishMessage = (type: NotifyType) => publishNotifyEvent(userId, type)

    useEffect(() => {
        let source = new EventSource(`${apiURL}/${userId}`);
        source.onmessage = (event) => {
            const data  = JSON.parse(event.data)
            if (data.type === "ALERT") {
                setOpenAlert(true)
                setAlertData(data)
            }

            if (data.type === "MODAL") {
                setOpenAlertDialog(true)
                setAlertDialogData(data)
            }
        };
        source.onerror = (err) =>  {
            console.log("Error occurred, attempting to reconnect", err);
            source = new EventSource(`${apiURL}/${userId}`);
        };
        return () => {
            source.close();
        };
    }, []);

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
            <AlertNotify show={openAlert} data={alertData} cb={setOpenAlert}/>
            <AlertDialogNotify show={openAlertDialog} data={alertDialogData} cb={setOpenAlertDialog}/>
        </main>
  );
}

export default App;
