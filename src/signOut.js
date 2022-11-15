import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBHq25W2RREUFHfM5xXRXD-fllj1YmRV-E",
    authDomain: "firsttime-17feb.firebaseapp.com",
    projectId: "firsttime-17feb",
    storageBucket: "firsttime-17feb.appspot.com",
    messagingSenderId: "276395725875",
    appId: "1:276395725875:web:02048bb845a6dc5ccebf46",
    measurementId: "G-VSJTYTXJ82"
  };

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

function logOut(){
    signOut(auth).then(() => {
      alert("Sign out successful");
      sessionStorage.removeItem("currentUser_uid");
    }).catch((error) => {
      console.log("An error happened");
    });
}

document.getElementById("SignOut").addEventListener("click", logOut);