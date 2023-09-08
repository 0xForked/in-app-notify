import React, {Dispatch, SetStateAction, useEffect, useRef} from "react";
import {Terminal} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "./ui/alert";
import {cn} from "../lib/utils";
import {NotifyData} from "@/src/models/notify";

interface AlertNotifyProps {
    show: boolean,
    data?: NotifyData | null,
    cb: Dispatch<SetStateAction<boolean>>
}

export function AlertNotify(props: AlertNotifyProps) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => props.cb(false), 5000);
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }
    }, [props.show, props.cb]);

    return (
        <div className={cn(
            "w-[350px] fixed bottom-0 right-0 mb-8 mr-8",
            `${props.show ? "visible" : "invisible"}`
        )}>
            <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>{props?.data?.title}</AlertTitle>
                <AlertDescription>
                    {props.data?.description}
                </AlertDescription>
            </Alert>
        </div>
    )
}