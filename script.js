/* ---------- FIREBASE ---------- */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-messaging.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";


/* ---------- TEXT WRAP HELPER (GLOBAL) ---------- */
window.wrapText = function(ctx, text, x, y, maxWidth, lineHeight){

  const words = (text || "").split(" ");
  let line = "";

  for(let n=0; n<words.length; n++){

    const testLine = line + words[n] + " ";
    const testWidth = ctx.measureText(testLine).width;

    if(testWidth > maxWidth && n > 0){
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    }else{
      line = testLine;
    }
  }

  ctx.fillText(line, x, y);
};

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

/* ---------- CANVAS DOWNLOAD ---------- */

window.downloadWord = function(){

const canvas = generateWordCard(); // 👈 तुम्हारा existing function

canvas.toBlob(function(blob){

const link = document.createElement("a");
link.href = URL.createObjectURL(blob);
link.download = "verthink_word.png";

document.body.appendChild(link);
link.click();
document.body.removeChild(link);

URL.revokeObjectURL(link.href);

}, "image/png");

};
function generateWordCard(){

const canvas = document.getElementById("shareCanvas");
const ctx = canvas.getContext("2d");

/* background */
ctx.fillStyle = "#0f2027";
ctx.fillRect(0,0,canvas.width,canvas.height);

/* word */
ctx.fillStyle = "#00eaff";
ctx.font = "bold 40px Arial";
ctx.textAlign = "center";

const word = document.getElementById("dailyWord").innerText;
ctx.fillText(word, canvas.width/2, 150);

/* meaning */
ctx.fillStyle = "#ffffff";
ctx.font = "20px Arial";

const meaning = document.getElementById("dailyMeaning").innerText;
wrapText(ctx, meaning, canvas.width/2, 220, 600, 26);

return canvas;
}

window.downloadQuote = function(){

const canvas = generateQuoteCard(); // 👈 तुम्हारा existing function

canvas.toBlob(function(blob){

const link = document.createElement("a");
link.href = URL.createObjectURL(blob);
link.download = "verthink_quote.png";

document.body.appendChild(link);
link.click();
document.body.removeChild(link);

URL.revokeObjectURL(link.href);

}, "image/png");

};

function generateQuoteCard(){

const canvas = document.getElementById("shareCanvas");
const ctx = canvas.getContext("2d");

/* background */
ctx.fillStyle = "#0f2027";
ctx.fillRect(0,0,canvas.width,canvas.height);

/* quote */
ctx.fillStyle = "#00eaff";
ctx.font = "22px Arial";
ctx.textAlign = "center";

const quote = document.getElementById("dailyThought").innerText;
wrapText(ctx, quote, canvas.width/2, 180, 600, 28);

/* author */
ctx.fillStyle = "#ffffff";
ctx.font = "18px Arial";

const author = document.getElementById("dailyAuthor").innerText;
ctx.fillText(author, canvas.width/2, 320);

return canvas;
}



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