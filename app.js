import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {

getAuth,

GoogleAuthProvider,

signInWithPopup,

signOut,

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {

getFirestore,

collection,

addDoc,

getDocs

} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


const firebaseConfig = {

apiKey:"AIzaSyBtotVbhe6RBn2QPQCSXbCVcY9rL_36KwM",

authDomain:"toppertimer-70de2.firebaseapp.com",

projectId:"toppertimer-70de2",

storageBucket:"toppertimer-70de2.appspot.com",

messagingSenderId:"809874833955",

appId:"1:809874833955:web:55580be4fcb2534a822796"

};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const provider = new GoogleAuthProvider();


let seconds=0;

let interval=null;


const userName=document.getElementById("userName");

const profilePic=document.getElementById("profilePic");


document.getElementById("loginBtn").onclick=()=>{

signInWithPopup(auth,provider);

};


document.getElementById("signupBtn").onclick=()=>{

signInWithPopup(auth,provider);

};


onAuthStateChanged(auth,(user)=>{

if(user){

userName.innerText=user.displayName;

profilePic.src=user.photoURL;

}

});


document.getElementById("settingsBtn").onclick=()=>{

let menu=document.getElementById("settingsMenu");

menu.style.display=menu.style.display==="block"?"none":"block";

};


document.getElementById("logoutBtn").onclick=()=>{

signOut(auth);

location.reload();

};


document.getElementById("startBtn").onclick=()=>{

interval=setInterval(()=>{

seconds++;

let min=Math.floor(seconds/60);

let sec=seconds%60;

document.getElementById("time").innerText=

`${min}:${sec.toString().padStart(2,"0")}`;

},1000);

};


document.getElementById("stopBtn").onclick=async()=>{

clearInterval(interval);

const user=auth.currentUser;

if(user){

await addDoc(collection(db,"studyTimes"),{

name:user.displayName,

time:seconds

});

loadLeaderboard();

}

};


document.getElementById("resetBtn").onclick=()=>{

seconds=0;

document.getElementById("time").innerText="00:00";

};


async function loadLeaderboard(){

const querySnapshot=await getDocs(collection(db,"studyTimes"));

const list=document.getElementById("leaderboardList");

list.innerHTML="";

querySnapshot.forEach(doc=>{

let data=doc.data();

let li=document.createElement("li");

li.innerText=data.name+" - "+data.time+" sec";

list.appendChild(li);

});

}

loadLeaderboard();
