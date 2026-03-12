import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
getAuth,
GoogleAuthProvider,
signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
getFirestore,
collection,
addDoc,
getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


const firebaseConfig = {

apiKey: "AIzaSyBtotVbhe6RBn2QPQCSXbCVcY9rL_36KwM",

authDomain: "toppertimer-70de2.firebaseapp.com",

projectId: "toppertimer-70de2",

storageBucket: "toppertimer-70de2.appspot.com",

messagingSenderId: "809874833955",

appId: "1:809874833955:web:55580be4fcb2534a822796"

};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const provider = new GoogleAuthProvider();


let user = null;

let seconds = 0;

let interval = null;


document.getElementById("loginBtn").onclick = async () => {

const result = await signInWithPopup(auth, provider);

user = result.user;

alert("Welcome " + user.displayName);

};


document.getElementById("startBtn").onclick = () => {

interval = setInterval(() => {

seconds++;

let min = Math.floor(seconds / 60);

let sec = seconds % 60;

document.getElementById("time").innerText =
`${min}:${sec.toString().padStart(2,"0")}`;

},1000);

};


document.getElementById("stopBtn").onclick = async () => {

clearInterval(interval);

if(user){

await addDoc(collection(db,"studyTimes"),{

name:user.displayName,

time:seconds

});

loadLeaderboard();

}

seconds = 0;

};


async function loadLeaderboard(){

const querySnapshot = await getDocs(collection(db,"studyTimes"));

const list = document.getElementById("leaderboardList");

list.innerHTML = "";

querySnapshot.forEach(doc=>{

let data = doc.data();

let li = document.createElement("li");

li.innerText = data.name + " - " + data.time + " sec";

list.appendChild(li);

});

}

loadLeaderboard();
