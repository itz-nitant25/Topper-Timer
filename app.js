import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
let timer = 0;
let interval = null;

document.getElementById("loginBtn").onclick = async () => {
  const result = await signInWithPopup(auth, provider);
  user = result.user;
  alert("Logged in as " + user.displayName);
};

document.getElementById("startBtn").onclick = () => {
  interval = setInterval(() => {
    timer++;
    document.getElementById("time").innerText = timer + " sec";
  },1000);
};

document.getElementById("stopBtn").onclick = async () => {
  clearInterval(interval);

  if(user){
    await addDoc(collection(db,"studyTimes"),{
      name:user.displayName,
      time:timer
    });

    alert("Study time saved!");
  }

  timer = 0;
};
