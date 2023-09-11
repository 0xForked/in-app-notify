import React, {useEffect} from 'react';
import {Button} from "./components/ui/button";
import {AlertNotify} from "./components/alert-notify";
import {AlertDialogNotify} from "./components/alert-dialog-notify";
import {NotifyType, publishNotifyEvent} from "./lib/api";
import {NotifyData} from "./models/notify";
import {onMessageListener, requestPermission} from "./lib/fcm";

// USAGE: http://localhost:3001/?user_id=65b38384-a192-4474-81e6-fc429a309e0c
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

    let query = new URLSearchParams(window.location.search);
    let userId = query.get('user_id');
    const publishMessage = (type: NotifyType) => publishNotifyEvent(
        userId as string, type)

    useEffect(() => {
        requestPermission(setFCMToken);
        const unsubscribe = onMessageListener().then((payload: any) => {
            try {
                const item = JSON.parse(payload?.data?.item)

                if(item?.type === "ALERT") {
                    setAlertData(item);
                    setOpenAlert(true);
                }

                if (item?.type === "MODAL") {
                    setAlertDialogData({
                        title: item?.title,
                        description: item?.description,
                        type: item?.type,
                        data: JSON.parse(item?.data),
                    })
                    setOpenAlertDialog(true);
                }
            } catch (e) {
                alert(e)
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
