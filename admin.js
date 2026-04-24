import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

/* ---------- FIREBASE ---------- */

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
const auth = getAuth(app);

/* ---------- SESSION TIMER ---------- */

let logoutTimer;

function startSessionTimer(){

// 5 minutes = 300000 ms
logoutTimer = setTimeout(()=>{
logout();
alert("Session expired ⏳ Please login again");
},300000);

}

/* ---------- LOGIN ---------- */

window.login = async function(){

const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();

try{

await signInWithEmailAndPassword(auth,email,password);

// show panel
document.querySelector(".login-card").style.display="none";
document.querySelectorAll(".admin-panel").forEach(p=>p.style.display="block");

// show logout button
document.getElementById("logoutBtn").style.display="block";

// start session timer
startSessionTimer();

}catch(err){
  console.log("ERROR CODE:", err.code);
  console.log("ERROR MSG:", err.message);
  document.getElementById("error").innerText = err.message;
}
};

/* ---------- AUTO LOGIN ---------- */

onAuthStateChanged(auth,(user)=>{

if(user){

document.querySelector(".login-card").style.display="none";
document.querySelectorAll(".admin-panel").forEach(p=>p.style.display="block");

document.getElementById("logoutBtn").style.display="block";

// restart timer on reload
startSessionTimer();

}

});

/* ---------- LOGOUT ---------- */

window.logout = async function(){

await signOut(auth);

clearTimeout(logoutTimer);

// reset UI
document.querySelector(".login-card").style.display="block";
document.querySelectorAll(".admin-panel").forEach(p=>p.style.display="none");

document.getElementById("logoutBtn").style.display="none";

};

/* ---------- UPDATE DAILY ---------- */

window.updateWord = async function(){

const word = document.getElementById("word").value;
const meaning = document.getElementById("meaning").value;
const thought = document.getElementById("thought").value;
const author = document.getElementById("author").value;

const date = new Date().toLocaleDateString("en-GB",{
day:"numeric",
month:"long",
year:"numeric"
});

await setDoc(doc(db,"dailyContent","today"),{
word,meaning,thought,author,date
});

alert("Updated ✅");

};

/* ---------- UPDATE EDITORIAL ---------- */

window.updateEditorial = async function(){

const content = document.getElementById("editorialContent").value;
const date = document.getElementById("editorialDate").value;

await setDoc(doc(db,"dailyContent","editorial"),{
content,date
});

alert("Editorial published 🚀");

};

let isExpanded = false;

function formatEditorial(content){

// First line = heading
let lines = content.split("\n");

let heading = lines[0];
let body = lines.slice(1).join("<br><br>");

document.getElementById("editorialHeading").innerText = heading;
document.getElementById("editorialContent").innerHTML = body;

}

function toggleEditorial(){

const content = document.getElementById("editorialContent");
const btn = document.getElementById("readToggle");

if(isExpanded){

content.classList.remove("expanded");
btn.innerText = "Read More";

}else{

content.classList.add("expanded");
btn.innerText = "Read Less";

}

isExpanded = !isExpanded;

};
window.logout = async function(){

await signOut(auth);

clearTimeout(logoutTimer);

// reset UI
document.querySelector(".login-card").style.display="block";
document.querySelectorAll(".admin-panel").forEach(p=>p.style.display="none");

document.getElementById("logoutBtn").style.display="none";

};