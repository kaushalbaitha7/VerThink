importScripts("https://www.gstatic.com/firebasejs/12.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
apiKey: "AIzaSyBM...",
authDomain: "verthink-kkb.firebaseapp.com",
projectId: "verthink-kkb",
messagingSenderId: "732567518586",
appId: "1:732567518586:web:2d9612aa832fa1491b6ac3"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload){

self.registration.showNotification(
payload.notification.title,
{
body: payload.notification.body,
icon: "/icon-192.png"
});

});