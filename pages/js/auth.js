// DOM Elements
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const googleLogin = document.getElementById("googleLogin");
const showLogin = document.getElementById("showLogin");
const showSignup = document.getElementById("showSignup");
const signupBox = document.querySelector(".signup-box");
const loginBox = document.querySelector(".login-box");
const authMessage = document.getElementById("authMessage");
const loginMessage = document.getElementById("loginMessage");

// Form Switching Logic
if (showLogin && showSignup && signupBox && loginBox) {
  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    signupBox.style.display = "none";
    loginBox.style.display = "block";
  });

  showSignup.addEventListener("click", (e) => {
    e.preventDefault();
    loginBox.style.display = "none";
    signupBox.style.display = "block";
  });
}

// Signup Handler
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const displayName = document.getElementById("displayName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        return cred.user.updateProfile({ displayName });
      })
      .then(() => {
        return db.collection("users").doc(auth.currentUser.uid).set({
          displayName,
          email,
          bio: "",
          reviews: 0,
          followers: 0,
          following: 0,
          profileImage: "default",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      })
      .then(() => {
        window.location.href = "./pages/html//pages/html/user-profile.html";
      })
      .catch((err) => {
        authMessage.textContent = err.message;
      });
  });
}

// Login Handler
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        window.location.href = "./pages/html//pages/html/user-profile.html";
      })
      .catch((err) => {
        loginMessage.textContent = err.message;
      });
  });
}

// Google Login Handler
if (googleLogin) {
  googleLogin.addEventListener("click", (e) => {
    e.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();

    auth
      .signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        if (result.additionalUserInfo.isNewUser) {
          return db.collection("users").doc(user.uid).set({
            displayName: user.displayName,
            email: user.email,
            bio: "I'm a new user on SeenIt!",
            reviews: 0,
            followers: 0,
            following: 0,
            profileImage: "default",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        }
      })
      .then(() => {
        window.location.href = "html//pages/html/user-profile.html";
      })
      .catch((err) => {
        authMessage.textContent = err.message;
      });
  });
}

// Auto-Redirect if already logged in
auth.onAuthStateChanged((user) => {
  if (user && window.location.pathname.includes("login-sign-up")) {
    window.location.href = "./pages/html//pages/html/user-profile.html";
  }
});
