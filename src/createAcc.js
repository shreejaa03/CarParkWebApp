import { initializeApp } from 'firebase/app';
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
//import { getDatabase, ref, set } from 'firebase/database';


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
//const db = getDatabase(firebaseApp);

  // Set up our register function 
  function register () {
    // Get all our input fields
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
   
    // Validate input fields
    if (validate_email(email) == false) {
        
        alert('Invalid Email')
        return 
        // Don't continue running the code
    }

    if(validate_password(password) == false)
    {
      alert('Invalid Password please ensure it is longer than 10 characters')
      return;
    }
    
    // Move on with Auth
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      alert("Your account has been created!")
      // ...
      /*set(ref(db, 'users/' + user.uid), {
        email: email
      });*/
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if(errorCode == 'auth/email-already-in-use')
      {
        alert('User already exists, please login');
      }
      console.log(errorCode);
      console.log(errorMessage);
    });
}


// Validate Functions
function validate_email(email) {
  var expression = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  
  if (expression.test(email)) 
  {
    // Email is good
    return true
  } 
  else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 10
  if (password.length < 10) {
    return false
  } else {
    return true
  }
}

document.getElementById('register').addEventListener("click", register);

