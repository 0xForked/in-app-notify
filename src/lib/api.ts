export const apiURL = "http://localhost:3000/api/v1/notifications"

export enum NotifyType  {
    Message = "message",
    Orbit = "orbit"
}

export async function publishNotifyEvent(
    userID: string,
    notifyType: NotifyType,
) {
    const response = await fetch(`${apiURL}/${userID}/${notifyType}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}