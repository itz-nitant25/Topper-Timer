import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {

getAuth,
GoogleAuthProvider,
signInWithPopup,
signOut,
onAuthStateChanged

}

from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {

getFirestore,
doc,
setDoc,
getDoc,
collection,
query,
orderBy,
limit,
getDocs

}

from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";



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



// MENU

document.getElementById("menuBtn").onclick=()=>{

let menu=document.getElementById("menu");

menu.style.display=

menu.style.display==="block"?"none":"block";

};



// LOGIN

document.getElementById("loginBtn").onclick=()=>{

signInWithPopup(auth,provider);

};



// SIGNUP

document.getElementById("signupBtn").onclick=()=>{

signInWithPopup(auth,provider);

};



// LOGOUT

document.getElementById("logoutBtn").onclick=()=>{

signOut(auth);

location.reload();

};



// USER STATE

onAuthStateChanged(auth,async(user)=>{

if(user){

userName.innerText=user.displayName;

profilePic.src=user.photoURL;



await setDoc(doc(db,"users",user.uid),{

name:user.displayName,

photo:user.photoURL,

totalTime:0

},{merge:true});



loadLeaderboard();

}

});



// START

document.getElementById("startBtn").onclick=()=>{

if(interval) return;

interval=setInterval(()=>{

seconds++;

let min=Math.floor(seconds/60);

let sec=seconds%60;



document.getElementById("time").innerText=

`${min}:${sec.toString().padStart(2,"0")}`;

},1000);

};



// STOP

document.getElementById("stopBtn").onclick=async()=>{

clearInterval(interval);

interval=null;

const user=auth.currentUser;

if(!user) return;



const ref=doc(db,"users",user.uid);

const snap=await getDoc(ref);



let oldTime=0;

if(snap.exists()){

oldTime=snap.data().totalTime||0;

}



await setDoc(ref,{

totalTime:oldTime+seconds

},{merge:true});



loadLeaderboard();

};



// RESET

document.getElementById("resetBtn").onclick=()=>{

seconds=0;

document.getElementById("time").innerText="00:00";

};



// LEADERBOARD

async function loadLeaderboard(){

const q=query(

collection(db,"users"),

orderBy("totalTime","desc"),

limit(5)

);



const querySnapshot=await getDocs(q);



const list=document.getElementById("leaderboardList");

list.innerHTML="";



querySnapshot.forEach(doc=>{

let data=doc.data();



let li=document.createElement("li");



li.innerHTML=

`<img src="${data.photo}" width="30" style="border-radius:50%"> 

${data.name} - ${data.totalTime}s`;



list.appendChild(li);

});

}
