/* ---------- DATA STORAGE ---------- */

let words = []
let quotes = []

/* ---------- LOAD DATASETS ---------- */

async function loadData(){

try{

const wordResponse = await fetch("softskills_words.json")
const quoteResponse = await fetch("motivation_quotes.json")

words = await wordResponse.json()
quotes = await quoteResponse.json()

loadDailyContent()

}catch(err){

console.error("Dataset load error:",err)

}

}

loadData()

/* ---------- RANDOM WORD ---------- */

function generateWord(){

if(words.length === 0) return

let random = Math.floor(Math.random()*words.length)

let w = words[random]

document.getElementById("popupWord").innerText =
w.word.toUpperCase()

document.getElementById("popupMeaning").innerText =
w.meaning

document.getElementById("popup").style.display="flex"

}

/* ---------- RANDOM QUOTE ---------- */

function generateThought(){

if(quotes.length === 0) return

let random = Math.floor(Math.random()*quotes.length)

let q = quotes[random]

document.getElementById("popupWord").innerText=""

document.getElementById("popupMeaning").innerHTML =
`"${q.quote}"<br><br><span class="author">— ${q.author}</span>`

document.getElementById("popup").style.display="flex"

}

/* ---------- DAILY WORD + QUOTE ---------- */

function loadDailyContent(){

if(words.length === 0 || quotes.length === 0) return

let today = new Date()

let seed =
today.getFullYear()*10000 +
(today.getMonth()+1)*100 +
today.getDate()

let wordIndex = seed % words.length
let quoteIndex = seed % quotes.length

let w = words[wordIndex]
let q = quotes[quoteIndex]

document.getElementById("dailyWord").innerText =
w.word.toUpperCase()

document.getElementById("dailyMeaning").innerText =
w.meaning

document.getElementById("dailyThought").innerText =
q.quote

document.getElementById("dailyAuthor").innerText =
"— " + q.author

/* date */

let formattedDate =
today.toLocaleDateString()

document.getElementById("dailyDate").innerText =
formattedDate

document.getElementById("dailyDate2").innerText =
formattedDate

}

/* ---------- POPUP CLOSE ---------- */

function closePopup(){

document.getElementById("popup").style.display="none"

}

window.onclick = function(e){

let popup = document.getElementById("popup")

if(e.target == popup){
popup.style.display="none"
}

}

/* ---------- SHARE FUNCTIONS ---------- */

function shareWord(){

let text =
document.getElementById("dailyWord").innerText +
" - " +
document.getElementById("dailyMeaning").innerText

window.open(
"https://wa.me/?text=" + encodeURIComponent(text)
)

}

function shareQuote(){

let text =
document.getElementById("dailyThought").innerText +
" " +
document.getElementById("dailyAuthor").innerText

window.open(
"https://wa.me/?text=" + encodeURIComponent(text)
)

}

/* ---------- BACKGROUND ANIMATION ---------- */

window.addEventListener("load", function(){

const bg = document.querySelector(".background-animation")

if(!bg){
console.log("background-animation container not found")
return
}

/* floating bubbles */

for(let i=0;i<40;i++){

let particle = document.createElement("span")

let size = Math.random()*20 + 10

particle.style.width = size + "px"
particle.style.height = size + "px"

particle.style.left = Math.random()*100 + "%"

particle.style.animationDuration =
(Math.random()*12 + 10) + "s"

particle.style.animationDelay =
Math.random()*5 + "s"

bg.appendChild(particle)

}

/* floating letters */

const letters =
"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

for(let i=0;i<35;i++){

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

})

let deferredPrompt

const installBtn = document.getElementById("installBtn")

window.addEventListener("beforeinstallprompt", (e) => {

e.preventDefault()

deferredPrompt = e

installBtn.style.display = "block"

})

installBtn.addEventListener("click", async () => {

if(deferredPrompt){

deferredPrompt.prompt()

const choice = await deferredPrompt.userChoice

if(choice.outcome === "accepted"){
console.log("App Installed")
}

deferredPrompt = null

}

})

if ("serviceWorker" in navigator) {

window.addEventListener("load", () => {

navigator.serviceWorker
.register("service-worker.js")
.then(() => console.log("SW registered"))

})

}

