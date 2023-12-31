import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTrigger,
} from "./ui/alert-dialog"
import React, {Dispatch, SetStateAction, useEffect, useRef} from "react";
import {NotifyData} from "../models/notify";
import {cn} from "../lib/utils";

interface AlertDialogNotifyProps {
    show: boolean,
    payload?: NotifyData | null,
    cb: Dispatch<SetStateAction<boolean>>
}

export function AlertDialogNotify(props: AlertDialogNotifyProps) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const [
        open,
        setOpen,
    ] = React.useState(false);

    useEffect(() => {
        setOpen(props.show)
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => props.cb(false), 5000);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        }
    }, [props])

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex flex-col gap-6 items-center py-8">
                        <h1 className="text-2xl text-gray-600"> {props?.payload?.title} </h1>
                        <img
                            src={props.payload?.data?.orbit?.image_url}
                            alt={props.payload?.data?.orbit?.id}
                            className={cn(
                                "w-24",
                                `${props.payload?.data?.orbit?.is_earned 
                                    ? "opacity-100" 
                                    : "opacity-50"} 
                            `)}
                        />
                        <h3 className="text-lg text-gray-600">{props.payload?.data?.orbit?.subtitle}</h3>
                    </div>
                    <div className="flex flex-col gap-6 items-center pb-8">
                        <h4 className="text-md">{props.payload?.description}</h4>
                        <div className="flex flex-row gap-6">
                            {props.payload?.data?.honors?.map((honor, index) =>
                                <img
                                    key={index}
                                    src={honor.image_url}
                                    alt={honor.id}
                                    className={cn(
                                        "w-16",
                                        `${honor?.is_earned
                                            ? "opacity-100"
                                            : "opacity-50"} 
                                    `)}
                                />
                            )}
                        </div>
                    </div>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    )
}