/* ---------- DATA VARIABLES ---------- */

let words = []
let itWords = []
let thoughts = []
let motivationQuotes = []

let unusedWords = []
let unusedThoughts = []


/* ---------- LOAD DATASETS ---------- */

/* Soft Skill Words */
fetch("softskills_words.json")
.then(res => res.json())
.then(data => {
words = data
unusedWords = [...words]
loadDailyContent()   // words
})

/* IT Vocabulary */
fetch("it_words.json")
.then(res => res.json())
.then(data => {
itWords = data
})

/* Business Quotes */
fetch("business_quotes.json")
.then(res => res.json())
.then(data => {
thoughts = data
unusedThoughts = [...thoughts]
loadDailyContent()   // words
})

/* Motivation Quotes */
fetch("motivation_quotes.json")
.then(res => res.json())
.then(data => {
motivationQuotes = data
loadDailyContent()   // words
})


/* ---------- WORD GENERATOR ---------- */

function generateWord(){

let allWords = [...words, ...itWords]

if(unusedWords.length === 0){
unusedWords = [...allWords]
}

let random = Math.floor(Math.random() * allWords.length)

let selected = allWords[random]

document.getElementById("popupWord").innerText =
selected.word.toUpperCase()

document.getElementById("popupMeaning").innerText =
selected.meaning

document.getElementById("popup").style.display = "flex"

}


/* ---------- THOUGHT GENERATOR ---------- */

function generateThought(){

let allQuotes = [...thoughts, ...motivationQuotes]

let random = Math.floor(Math.random() * allQuotes.length)

let selected = allQuotes[random]

document.getElementById("popupWord").innerText = ""

document.getElementById("popupMeaning").innerHTML =
`"${selected.quote}"<br><br><span class="author">— ${selected.author}</span>`

document.getElementById("popup").style.display = "flex"

}


/* ---------- CLOSE POPUP ---------- */

function closePopup(){
document.getElementById("popup").style.display = "none"
}

window.onclick = function(e){

let popup = document.getElementById("popup")

if(e.target == popup){
popup.style.display = "none"
}

}


/* ---------- BACKGROUND ANIMATION ---------- */

const bg = document.querySelector(".background-animation")


/* Floating Bubbles */

for(let i = 0; i < 40; i++){

let particle = document.createElement("span")

let size = Math.random()*20 + 10

particle.style.width = size + "px"
particle.style.height = size + "px"

particle.style.left = Math.random()*100 + "%"

particle.style.animationDuration = (Math.random()*10 + 10) + "s"
particle.style.animationDelay = Math.random()*5 + "s"

bg.appendChild(particle)

}


/* Floating Alphabets */

const letters =
"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

for(let i = 0; i < 45; i++){

let letter = document.createElement("span")

letter.classList.add("floating-letter")

letter.innerText =
letters[Math.floor(Math.random()*letters.length)]

letter.style.left = Math.random()*100 + "%"

letter.style.fontSize =
(Math.random()*50 + 15) + "px"

letter.style.animationDuration =
(Math.random()*20 + 10) + "s"

letter.style.animationDelay =
Math.random()*10 + "s"

letter.style.transform =
`rotate(${Math.random()*360}deg)`

bg.appendChild(letter)

}

function loadDailyContent(){

let today = new Date()

let dayNumber =
today.getFullYear()*1000 +
today.getMonth()*50 +
today.getDate()

/* Daily Word */

let wordIndex = dayNumber % words.length
let word = words[wordIndex]

document.getElementById("dailyWord").innerText =
word.word.toUpperCase()

document.getElementById("dailyMeaning").innerText =
word.meaning

/* Daily Thought */

let allQuotes = [...thoughts,...motivationQuotes]

let quoteIndex = dayNumber % allQuotes.length

let quote = allQuotes[quoteIndex]

document.getElementById("dailyThought").innerText =
quote.quote

document.getElementById("dailyAuthor").innerText =
"— " + quote.author

/* Date */

let formattedDate =
today.toLocaleDateString()

document.getElementById("dailyDate").innerText =
formattedDate

document.getElementById("dailyDate2").innerText =
formattedDate

}

setTimeout(()=>{
loadDailyContent()
},500)
window.open(
"https://wa.me/?text=" + encodeURIComponent(text)
)

if("serviceWorker" in navigator){

navigator.serviceWorker.register("service-worker.js")

}
let deferredPrompt;

const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {

e.preventDefault();

deferredPrompt = e;

installBtn.style.display = "block";

});

installBtn.addEventListener("click", async () => {

if(deferredPrompt){

deferredPrompt.prompt();

const choice = await deferredPrompt.userChoice;

if(choice.outcome === "accepted"){

console.log("App installed");

}

deferredPrompt = null;

}

});