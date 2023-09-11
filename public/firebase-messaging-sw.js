// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyAQg2f4XhRIfSNnGCOWRLdeixOSl2QRVzo",
    authDomain: "fookipoke-studio.firebaseapp.com",
    projectId: "fookipoke-studio",
    storageBucket: "fookipoke-studio.appspot.com",
    messagingSenderId: "991369191835",
    appId: "1:991369191835:web:f6be06ae8458cec2a4c13e"
});

firebase.messaging().onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/logo192.png'
    };
    self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});