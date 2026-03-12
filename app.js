const firebaseConfig = {
apiKey:"YOUR_KEY",
authDomain:"YOUR_DOMAIN",
projectId:"YOUR_PROJECT_ID"
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()

const provider = new firebase.auth.GoogleAuthProvider()

document.getElementById("login").onclick = () => {

auth.signInWithPopup(provider)

}

document.getElementById("logout").onclick = () => {

auth.signOut()

}

let time = 1500
let interval

function update(){

let m = Math.floor(time/60)
let s = time%60

document.getElementById("timer").innerText =
m + ":" + (s<10?"0"+s:s)

}

function startTimer(){

interval = setInterval(()=>{

time--

update()

if(time<=0){

clearInterval(interval)

alert("Study completed!")

saveStudy()

}

},1000)

}

function resetTimer(){

clearInterval(interval)

time=1500

update()

}

function saveStudy(){

const user = auth.currentUser

if(!user) return

db.collection("study").add({

name:user.displayName,
minutes:25,
date:new Date()

})

updateStreak()

loadLeaderboard()

}

function loadLeaderboard(){

db.collection("study")

.orderBy("minutes","desc")

.limit(10)

.get()

.then(snapshot=>{

let table = document.getElementById("leaderboard")

table.innerHTML=""

let rank=1

snapshot.forEach(doc=>{

let data = doc.data()

let row = document.createElement("tr")

row.innerHTML=

`<td>${rank}</td>
<td>${data.name}</td>
<td>${data.minutes}</td>`

table.appendChild(row)

rank++

})

})

}

function updateStreak(){

let streak = localStorage.getItem("streak") || 0

streak++

localStorage.setItem("streak",streak)

document.getElementById("streak").innerText =
"🔥 Streak: " + streak + " days"

}

function startBattle(){

let friend = document.getElementById("friendName").value

let myScore = Math.floor(Math.random()*120)

let friendScore = Math.floor(Math.random()*120)

let winner = myScore > friendScore ? "You Win!" : friend + " Wins!"

document.getElementById("battleResult").innerHTML =

`
<p>You studied: ${myScore} minutes</p>
<p>${friend} studied: ${friendScore} minutes</p>
<h3>${winner}</h3>
`

}

loadLeaderboard()
