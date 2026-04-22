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

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

const messaging = getMessaging(app)


/* ---------- DATASET ---------- */

let words=[]
let quotes=[]

async function loadData(){

const wordResponse = await fetch("softskills_words.json")
const quoteResponse = await fetch("motivation_quotes.json")

words = await wordResponse.json()
quotes = await quoteResponse.json()

}

loadData()


/* ---------- REALTIME DAILY CONTENT ---------- */

function loadDailyContent(){

const ref = doc(db,"dailyContent","today")

onSnapshot(ref,(snap)=>{

if(!snap.exists()) return

const data = snap.data()

document.getElementById("dailyWord").textContent=data.word
document.getElementById("dailyMeaning").textContent=data.meaning

document.getElementById("dailyThought").textContent=data.thought
document.getElementById("dailyAuthor").textContent="— "+data.author

document.getElementById("dailyDate").textContent=data.date
document.getElementById("dailyDate2").textContent=data.date

})

}

loadDailyContent()


/* ---------- RANDOM WORD ---------- */

window.generateWord=function(){

if(words.length===0) return

let random=Math.floor(Math.random()*words.length)

let w=words[random]

document.getElementById("popupWord").innerText=w.word.toUpperCase()
document.getElementById("popupMeaning").innerText=w.meaning

document.getElementById("popup").style.display="flex"

}


/* ---------- RANDOM QUOTE ---------- */

window.generateThought=function(){

if(quotes.length===0) return

let random=Math.floor(Math.random()*quotes.length)

let q=quotes[random]

document.getElementById("popupWord").innerText=""

document.getElementById("popupMeaning").innerHTML=
`"${q.quote}"<br><br><span class="author">— ${q.author}</span>`

document.getElementById("popup").style.display="flex"

}


/* ---------- POPUP CLOSE ---------- */

window.closePopup=function(){

document.getElementById("popup").style.display="none"

}


/* ---------- SHARE WORD ---------- */

window.shareWord=async function(){

const text=
document.getElementById("dailyWord").innerText+
" - "+
document.getElementById("dailyMeaning").innerText

window.open(
"https://api.whatsapp.com/send?text="+encodeURIComponent(text)
)

}


/* ---------- SHARE QUOTE ---------- */

window.shareQuote=async function(){

const text=
document.getElementById("dailyThought").innerText+
" "+
document.getElementById("dailyAuthor").innerText

window.open(
"https://api.whatsapp.com/send?text="+encodeURIComponent(text)
)

}


/* ---------- DOWNLOAD WORD CARD ---------- */

window.downloadWord=function(){

const canvas=document.getElementById("shareCanvas")
const ctx=canvas.getContext("2d")

ctx.fillStyle="#0f2027"
ctx.fillRect(0,0,800,420)

ctx.fillStyle="white"
ctx.font="bold 48px Segoe UI"
ctx.textAlign="center"

ctx.fillText(
document.getElementById("dailyWord").innerText,
400,
180
)

ctx.font="26px Segoe UI"

ctx.fillText(
document.getElementById("dailyMeaning").innerText,
400,
240
)

const link=document.createElement("a")

link.download="verthink_word.png"

link.href=canvas.toDataURL()

link.click()

}


/* ---------- DOWNLOAD QUOTE CARD ---------- */

window.downloadQuote=function(){

const canvas=document.getElementById("shareCanvas")
const ctx=canvas.getContext("2d")

ctx.fillStyle="#0f2027"
ctx.fillRect(0,0,800,420)

ctx.fillStyle="white"
ctx.font="28px Segoe UI"
ctx.textAlign="center"

ctx.fillText(
document.getElementById("dailyThought").innerText,
400,
200
)

ctx.font="20px Segoe UI"

ctx.fillText(
document.getElementById("dailyAuthor").innerText,
400,
260
)

const link=document.createElement("a")

link.download="verthink_quote.png"

link.href=canvas.toDataURL()

link.click()

}


/* ---------- NOTIFICATION ---------- */

window.enableNotification = async function(){

const permission = await Notification.requestPermission();

if(permission === "granted"){

const token = await getToken(messaging,{
vapidKey:"BDYr5fX-tLnNtx-7KMBI3GtLl8Hj_gsnoiDO3JXBZf_3fOHgbZFnVhX5W4S-t-IhzfNUyAe9zqyYhOX7t4ctUDU"
});

console.log("TOKEN:",token);

/* Subscribe user to topic */

await fetch(
"https://iid.googleapis.com/iid/v1/"+token+"/rel/topics/verthink_users",
{
method:"POST",
headers:{
"Authorization":"key=AIzaSyDd_17BtjdY1nf3xvVhnLy1w3qEZvqeAgc",
"Content-Type":"application/json"
}
}
);

alert("Notifications Enabled 🔔");

}

};

/* ---------- RECEIVE NOTIFICATION ---------- */

onMessage(messaging,(payload)=>{

new Notification(payload.notification.title,{

body:payload.notification.body,
icon:"/icon-192.png"

})

})


/* ---------- INSTALL APP ---------- */

let deferredPrompt

const installBtn=document.getElementById("installBtn")

if(installBtn){

installBtn.addEventListener("click",async()=>{

if(deferredPrompt){

deferredPrompt.prompt()
await deferredPrompt.userChoice
deferredPrompt=null

}

})

}

const bg = document.querySelector(".background-animation")

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

for(let i=0;i<40;i++){

let letter = document.createElement("span")

letter.classList.add("floating-letter")

letter.innerText =
letters[Math.floor(Math.random()*letters.length)]

letter.style.left = Math.random()*100 + "%"

letter.style.fontSize =
(Math.random()*50 + 15) + "px"

letter.style.animationDuration =
(Math.random()*20 + 12) + "s"

letter.style.animationDelay =
Math.random()*6 + "s"

bg.appendChild(letter)

}

/* ---------- SERVICE WORKER ---------- */

if("serviceWorker" in navigator){

window.addEventListener("load",()=>{

navigator.serviceWorker.register("service-worker.js")

navigator.serviceWorker.register("firebase-messaging-sw.js")

})

}