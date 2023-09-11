import React, {useEffect} from 'react';
import {Button} from "./components/ui/button";
import {AlertNotify} from "./components/alert-notify";
import {AlertDialogNotify} from "./components/alert-dialog-notify";
import {NotifyType, publishNotifyEvent} from "./lib/api";
import {NotifyData} from "./models/notify";
import {onMessageListener, requestPermission} from "./lib/fcm";

function App() {
    const [
        fcmToken,
        setFCMToken,
    ] = React.useState<String | null>(null);

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

    const publishMessage = (type: NotifyType) => publishNotifyEvent(fcmToken as string, type)

    useEffect(() => {
        requestPermission(setFCMToken);
        const unsubscribe = onMessageListener().then((payload: any) => {
            if (payload) {
                console.log(payload)
            }

            if(payload?.data.type === "ALERT") {
                setAlertData(payload?.data);
                setOpenAlert(true);
            }

            if (payload?.data.type === "MODAL") {
                setAlertDialogData({
                    title: payload?.data?.title,
                    description: payload?.data?.description,
                    type: payload?.data?.type,
                    data: JSON.parse( payload?.data?.data),
                })
                setOpenAlertDialog(true);
            }
        });
        return () => {
            unsubscribe.catch((err) => console.log('failed: ', err));
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
            <AlertNotify show={openAlert} payload={alertData} cb={setOpenAlert}/>
            <AlertDialogNotify show={openAlertDialog} payload={alertDialogData} cb={setOpenAlertDialog}/>
        </main>
  );
}

export default App;
