/* ---------- FIREBASE ---------- */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-messaging.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyBM2gM2d24Fp3wH9v0sb0a_UChuz1KvFR8",
authDomain: "verthink-kkb.firebaseapp.com",
projectId: "verthink-kkb",
storageBucket: "verthink-kkb.firebasestorage.app",
messagingSenderId: "732567518586",
appId: "1:732567518586:web:2d9612aa832fa1491b6ac3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messaging = getMessaging(app);

/* ---------- DATA ---------- */

let words = [];
let quotes = [];

async function loadData(){
const w = await fetch("softskills_words.json");
const q = await fetch("motivation_quotes.json");

words = await w.json();
quotes = await q.json();
}

/* ---------- EDITORIAL ---------- */

let isExpanded = false;

function loadEditorial(){

const ref = doc(db,"dailyContent","editorial");

onSnapshot(ref,(snap)=>{

if(!snap.exists()) return;

const data = snap.data();

const contentEl = document.getElementById("editorialContent");
const btn = document.getElementById("readToggle");

if(!contentEl || !btn) return;

/* FORMAT CONTENT */
let rawText = (data.content || "").trim();
let lines = rawText.split("\n");
let formatted = lines.join("<br><br>");

contentEl.innerHTML = formatted;

/* DATE */
document.getElementById("editorialDate").textContent = data.date || "";

/* RESET STATE */
contentEl.classList.remove("expanded");
btn.innerText = "Read More";
btn.style.display = "none";
isExpanded = false;

/* SHOW BUTTON LOGIC (STABLE) */
if(rawText.length > 300 || lines.length > 5){
btn.style.display = "inline-block";
}else{
btn.style.display = "none";
}

});
}


/* ---------- TOGGLE ---------- */

window.toggleEditorial = function(){

const content = document.getElementById("editorialContent");
const btn = document.getElementById("readToggle");

if(!content || !btn) return;

/* TOGGLE STATE */
isExpanded = !isExpanded;

if(isExpanded){
content.classList.add("expanded");
btn.innerText = "Read Less";
}else{
content.classList.remove("expanded");
btn.innerText = "Read More";
}

};

/* ---------- DAILY CONTENT ---------- */

function loadDailyContent(){
const ref = doc(db,"dailyContent","today");

onSnapshot(ref,(snap)=>{
if(!snap.exists()) return;

const data = snap.data();

document.getElementById("dailyWord").textContent = data.word;
document.getElementById("dailyMeaning").textContent = data.meaning;

document.getElementById("dailyThought").textContent = data.thought;
document.getElementById("dailyAuthor").textContent = "— " + data.author;

document.getElementById("dailyDate").textContent = data.date;
document.getElementById("dailyDate2").textContent = data.date;
});
}

/* ---------- POPUP ---------- */

window.generateWord = function(){
if(words.length === 0) return;

let w = words[Math.floor(Math.random()*words.length)];

popupWord.innerText = w.word.toUpperCase();
popupMeaning.innerText = w.meaning;
popup.style.display = "flex";
};

window.generateThought = function(){
if(quotes.length === 0) return;

let q = quotes[Math.floor(Math.random()*quotes.length)];

popupWord.innerText = "";
popupMeaning.innerHTML = `"${q.quote}"<br><br>— ${q.author}`;
popup.style.display = "flex";
};

window.closePopup = ()=> popup.style.display="none";

/* ---------- SHARE ---------- */

window.shareWord = ()=>{
let text = dailyWord.innerText + " - " + dailyMeaning.innerText;
window.open("https://api.whatsapp.com/send?text="+encodeURIComponent(text));
};

window.shareQuote = ()=>{
let text = dailyThought.innerText + " " + dailyAuthor.innerText;
window.open("https://api.whatsapp.com/send?text="+encodeURIComponent(text));
};

/* ---------- NOTIFICATION ---------- */

window.enableNotification = async function(){

const permission = await Notification.requestPermission();

if(permission !== "granted"){
alert("Permission denied ❌");
return;
}

const token = await getToken(messaging,{
vapidKey:"BDYr5fX-tLnNtx..."
});

console.log("TOKEN:",token);

alert("Notification Enabled 🔔");
};

/* Receive */

onMessage(messaging,(payload)=>{
new Notification(payload.notification.title,{
body:payload.notification.body,
icon:"/icon-192.png"
});
});

/* ---------- INSTALL BUTTON ---------- */

let deferredPrompt;

window.addEventListener("beforeinstallprompt",(e)=>{
e.preventDefault();
deferredPrompt = e;

const btn = document.getElementById("installBtn");
if(btn) btn.style.display = "flex";
});

document.getElementById("installBtn")?.addEventListener("click",async()=>{

if(!deferredPrompt){
alert("Install not available yet");
return;
}

deferredPrompt.prompt();
await deferredPrompt.userChoice;
deferredPrompt = null;

});

function createFloatingLetters(){

const container = document.querySelector(".background-animation");

if(!container){
console.log("❌ container not found");
return;
}

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

for(let i=0;i<25;i++){

let span = document.createElement("span");

span.className = "floating-letter";

span.innerText = letters[Math.floor(Math.random()*letters.length)];

/* random position */
span.style.left = Math.random()*100 + "vw";

/* random size */
span.style.fontSize = (14 + Math.random()*30) + "px";

/* random speed */
span.style.animationDuration = (8 + Math.random()*10) + "s";

/* random delay */
span.style.animationDelay = (Math.random()*5) + "s";

container.appendChild(span);

}

}

window.addEventListener("DOMContentLoaded",()=>{
createFloatingLetters();
});

/* ---------- SERVICE WORKER ---------- */

if("serviceWorker" in navigator){

window.addEventListener("load",()=>{

navigator.serviceWorker.register("/service-worker.js");
navigator.serviceWorker.register("/firebase-messaging-sw.js");

});

}

/* ---------- INIT ---------- */

window.addEventListener("load",async ()=>{

await loadData();
loadEditorial();
loadDailyContent();

});