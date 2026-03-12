const firebaseConfig = {

apiKey:"AIzaSyBtotVbhe6RBn2QPQCSXbCVcY9rL_36KwM",
authDomain:"toppertimer-70de2.firebaseapp.com",
projectId:"toppertimer-70de2"

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

let m=Math.floor(time/60)
let s=time%60

document.getElementById("timer").innerText =
m + ":" + (s<10?"0"+s:s)

}

function startTimer(){

interval=setInterval(()=>{

time--
update()

if(time<=0){

clearInterval(interval)

alert("Session completed")

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

loadLeaderboard()

updateStreak()

}

function loadLeaderboard(){

db.collection("study")
.orderBy("minutes","desc")
.limit(10)
.get()

.then(snapshot=>{

let table=document.getElementById("leaderboard")

table.innerHTML=""

let rank=1

snapshot.forEach(doc=>{

let d=doc.data()

let row=document.createElement("tr")

row.innerHTML=
`<td>${rank}</td>
<td>${d.name}</td>
<td>${d.minutes}</td>`

table.appendChild(row)

rank++

})

})

}

function updateStreak(){

let s=localStorage.getItem("streak")||0

s++

localStorage.setItem("streak",s)

document.getElementById("streak").innerText=
"🔥 Streak: "+s

}

function battle(){

let friend=document.getElementById("friend").value

let my=Math.floor(Math.random()*120)
let fr=Math.floor(Math.random()*120)

let winner=my>fr?"You Win!":friend+" Wins!"

document.getElementById("battleResult").innerHTML=

`You: ${my} min <br>
${friend}: ${fr} min <br>
<b>${winner}</b>`

}

function plan(){

let subject=document.getElementById("subject").value

let plan=

`Study Plan for ${subject}

1️⃣ 25 min deep study
2️⃣ 5 min break
3️⃣ 25 min revision
4️⃣ 10 min practice questions`

document.getElementById("planResult").innerText=plan

}

loadLeaderboard()
