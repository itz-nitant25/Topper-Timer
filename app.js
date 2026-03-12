const firebaseConfig = {

apiKey: "AIzaSyBtotVbhe6RBn2QPQCSXbCVcY9rL_36KwM",
authDomain: "toppertimer-70de2.firebaseapp.com",
projectId: "toppertimer-70de2",
storageBucket: "toppertimer-70de2.firebasestorage.app",
messagingSenderId: "809874833955",
appId: "1:809874833955:web:55580be4fcb2534a822796"

};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

loginBtn.onclick = () => {

auth.signInWithPopup(provider);

};

logoutBtn.onclick = () => {

auth.signOut();

};

let time = 1500;
let interval;

function updateTimer(){

let m = Math.floor(time/60);
let s = time % 60;

document.getElementById("timer").innerText =
m + ":" + (s < 10 ? "0"+s : s);

}

function startTimer(){

interval = setInterval(()=>{

time--;

updateTimer();

if(time <= 0){

clearInterval(interval);

alert("Study session completed!");

saveStudy();

}

},1000);

}

function resetTimer(){

clearInterval(interval);

time = 1500;

updateTimer();

}

function saveStudy(){

const user = auth.currentUser;

if(!user) return;

db.collection("study").add({

name: user.displayName,
minutes: 25,
date: new Date()

}).then(()=>{

loadLeaderboard();

});

updateStreak();

}

function loadLeaderboard(){

db.collection("study")
.orderBy("minutes","desc")
.limit(10)
.get()

.then(snapshot=>{

let table = document.getElementById("leaderboard");

table.innerHTML = "";

let rank = 1;

snapshot.forEach(doc=>{

let data = doc.data();

let row = document.createElement("tr");

row.innerHTML =
`<td>${rank}</td>
<td>${data.name}</td>
<td>${data.minutes}</td>`;

table.appendChild(row);

rank++;

});

});

}

function updateStreak(){

let streak = localStorage.getItem("streak") || 0;

streak++;

localStorage.setItem("streak",streak);

document.getElementById("streak").innerText =
"🔥 Streak: " + streak;

}

loadLeaderboard();
