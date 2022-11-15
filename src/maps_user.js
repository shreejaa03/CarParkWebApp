// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push } from "firebase/database";
import { getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHq25W2RREUFHfM5xXRXD-fllj1YmRV-E",
  authDomain: "firsttime-17feb.firebaseapp.com",
  databaseURL: "https://firsttime-17feb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "firsttime-17feb",
  storageBucket: "firsttime-17feb.appspot.com",
  messagingSenderId: "276395725875",
  appId: "1:276395725875:web:02048bb845a6dc5ccebf46",
  measurementId: "G-VSJTYTXJ82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth();

async function generate_table(nearbycarpark) {
  var body = document.getElementsByTagName("body")[0];

  // creates a <table> element and a <tbody> element
  var tbl = document.createElement("table");
  var tblBody = document.createElement("tbody");
  tbl.id = "myTable"
  // creating all cells
  for (var i = 0; i < 5; i++) {
    // creates a table row
    if(i==nearbycarpark.length)
      break;
    var row = document.createElement("tr");
    row.id = nearbycarpark[i].car_park_no;

    // Create a <td> element and a text node, make the text
    // node the contents of the <td>, and put the <td> at
    // the end of the table row
    var cell = document.createElement("td");
    var cellText = document.createTextNode(nearbycarpark[i].address);
    cell.appendChild(cellText);
    row.appendChild(cell);

    /*var cell = document.createElement("td");
    var cellText = document.createTextNode(nearbycarpark[i].distance);
    cell.appendChild(cellText);
    row.appendChild(cell);*/

    var btn = document.createElement("button");

    btn.innerHTML = "Add to favorites";
    btn.className = "btnDB";
    row.appendChild(btn);

    // add the row to the end of the table body
    tblBody.appendChild(row);
  }

  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  body.appendChild(tbl);
  // sets the border attribute of tbl to 2;
  tbl.setAttribute("border", "2");
}
const text = localStorage.getItem("nearbycarpark");
const nearbycarpark = JSON.parse(text);
generate_table(nearbycarpark);

function addTofavorites(cpName, cpNum, cpWeekDayRate, cpSatRate, cpSunPhRate, user){
  const postListRef = ref(db, 'users/' + user + '/favCarParks/' + cpNum);
  const newPostRef = push(postListRef);
  set(postListRef, {
    carparkName: cpName,
    carparkWeekDayRate: cpWeekDayRate,
    carparkSatDayRate: cpSatRate,
    carparkSunPHrate: cpSunPhRate,
  })
}


const user = sessionStorage.getItem("currentUser_uid");

document.querySelectorAll('.btnDB').forEach(item => {
  item.addEventListener('click', event => {
    const cpName = item.parentElement.cells[0].innerHTML;
    const cpNum = item.parentElement.id;
    var cpWeekDayRate;
    var cpSatRate;
    var cpSunPhRate;
    for(var i = 0; i<nearbycarpark.length; i++)
    {
      if(nearbycarpark[i].car_park_no == cpNum)
      {
        cpWeekDayRate = nearbycarpark[i].weekdayRate;
        cpSatRate = nearbycarpark[i].satdayRate;
        cpSunPhRate = nearbycarpark[i].sunPHRate;
      }
    }
    addTofavorites(cpName, cpNum, cpWeekDayRate, cpSatRate, cpSunPhRate, user);
    })
})