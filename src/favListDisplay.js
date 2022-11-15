import { initializeApp } from 'firebase/app';
import { getDatabase, ref, child, get, remove } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBHq25W2RREUFHfM5xXRXD-fllj1YmRV-E",
    authDomain: "firsttime-17feb.firebaseapp.com",
    projectId: "firsttime-17feb",
    storageBucket: "firsttime-17feb.appspot.com",
    messagingSenderId: "276395725875",
    appId: "1:276395725875:web:02048bb845a6dc5ccebf46",
    measurementId: "G-VSJTYTXJ82",
    databaseURL: "https://firsttime-17feb-default-rtdb.asia-southeast1.firebasedatabase.app"
  };

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const userId = sessionStorage.getItem("currentUser_uid");
const db = getDatabase();
const dbRef = ref(getDatabase());

/*carparkName: cpName,
carparkWeekDayRate: cpWeekDayRate,
carparkSatDayRate: cpSatRate,
carparkSunPHrate: cpSunPhRate,*/

let table = document.createElement('table');
let thead = document.createElement('thead');
let tbody = document.createElement('tbody');
let row_1 = document.createElement('tr');
let heading_1 = document.createElement('th');
heading_1.innerHTML = "Carpark Name";
let heading_2 = document.createElement('th');
heading_2.innerHTML = "Weekday Rate";
let heading_3 = document.createElement('th');
heading_3.innerHTML = "Saturday Rate";
let heading_4 = document.createElement('th');
heading_4.innerHTML = "Sunday/PH Rate";
let heading_5 = document.createElement('th');
heading_5.innerHTML = "Remove";
row_1.appendChild(heading_1);
row_1.appendChild(heading_2);
row_1.appendChild(heading_3);
row_1.appendChild(heading_4);
row_1.appendChild(heading_5);
thead.appendChild(row_1);

table.appendChild(thead);
table.appendChild(tbody);

// Adding the entire table to the body tag
document.getElementById('body').appendChild(table);
get(child(dbRef, `users/${userId}`)).then((snapshot) => {
  if (snapshot.exists()) {
    snapshot.forEach(function(childSnapshot) {
        childSnapshot.forEach(function(grandChildSnapshot){
            let row_2 = document.createElement('tr');
            row_2.id = grandChildSnapshot.key;
            let row_2_data_1 = document.createElement('td');
            row_2_data_1.innerHTML = grandChildSnapshot.val()["carparkName"];
            let row_2_data_2 = document.createElement('td');
            row_2_data_2.innerHTML = grandChildSnapshot.val()["carparkWeekDayRate"];
            let row_2_data_3 = document.createElement('td');
            row_2_data_3.innerHTML = grandChildSnapshot.val()["carparkSatDayRate"];
            let row_2_data_4 = document.createElement('td');
            row_2_data_4.innerHTML = grandChildSnapshot.val()["carparkSunPHrate"];
            let row_2_btn = document.createElement('button');
            row_2_btn.innerHTML = "Remove";
            row_2_btn.className = "removeFav";
            row_2.appendChild(row_2_data_1);
            row_2.appendChild(row_2_data_2);
            row_2.appendChild(row_2_data_3);
            row_2.appendChild(row_2_data_4);
            row_2.appendChild(row_2_btn);
            tbody.appendChild(row_2);
            row_2_btn.addEventListener("click", function(){
              removeFav(row_2);
            });
        })
    });
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

table.setAttribute("border", "2");
tbody.id = "favListBody";
thead.id = "favListHeader";
table.id = "favList";

function removeFav(item){
  var user = sessionStorage.getItem("currentUser_uid");
  var cpNum = item.id;
  tbody.removeChild(item);
  const postRef = ref(db, 'users/' + user + '/favCarParks/' + cpNum);
  remove(postRef);
}

