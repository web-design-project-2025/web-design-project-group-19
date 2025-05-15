
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaCok0sNM7U97CDFGnV1fpdR8DaK2kq3M",
  authDomain: "seenit-9ec06.firebaseapp.com",
  projectId: "seenit-9ec06",
  storageBucket: "seenit-9ec06.firebasestorage.app",
  messagingSenderId: "437565688701",
  appId: "1:437565688701:web:8ca099d80bef9e63a29a14"
};

// Initialize Firebase
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize services
const db = firebase.firestore();  // Now this should work
const auth = firebase.auth();

// Make available globally if needed
window.db = db;
window.auth = auth;



//Firebase used on suggestion of Janos Papp - Sophia's friend