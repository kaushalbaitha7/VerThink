import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";

import { 
getAuth,
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

import {
getFirestore,
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const firebaseConfig = {

apiKey: "AIzaSyBM2gM2d24Fp3wH9v0sb0a_UChuz1KvFR8",
authDomain: "verthink-kkb.firebaseapp.com",
projectId: "verthink-kkb",
storageBucket: "verthink-kkb.firebasestorage.app",
messagingSenderId: "732567518586",
appId: "1:732567518586:web:2d9612aa832fa1491b6ac3"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


/* LOGIN */

window.login = async function(){

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

try{

await signInWithEmailAndPassword(auth,email,password);

document.querySelector(".login-card").style.display="none";

document.querySelector(".admin-panel").style.display="block";

}
catch(err){

document.getElementById("error").innerText="Invalid Login";

}

}


/* UPDATE WORD */

window.updateWord = async function(){

const word =
document.getElementById("word").value;

const meaning =
document.getElementById("meaning").value;

const thought =
document.getElementById("thought").value;

const author =
document.getElementById("author").value;

const date =
new Date().toLocaleDateString();

await setDoc(doc(db,"dailyContent","today"),{

word:word,
meaning:meaning,
thought:thought,
author:author,
date:date

});

alert("Daily Word Updated Successfully");

}