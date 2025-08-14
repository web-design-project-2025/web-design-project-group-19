// DOM elements
const logoutBtn = document.getElementById("logoutBtn");
const profilePicture = document.getElementById("profilePicture");
const usernameProfile = document.getElementById("usernameProfile");
const userBio = document.getElementById("userBio");
const editBioBtn = document.getElementById("editBioBtn");
const reviewCount = document.getElementById("reviewCount");
const followerCount = document.getElementById("followerCount");
const followingCount = document.getElementById("followingCount");
const joinDate = document.getElementById("joinDate");

// Logout function
logoutBtn.addEventListener("click", () => {
  auth
    .signOut()
    .then(() => {
      window.location.href = "/web-design-project-group-19/pages/html/login-signup-page.html";
    })
    .catch((err) => {
      console.error("Logout error:", err);
    });
});

// Check auth state
auth.onAuthStateChanged((user) => {
  if (!user) {
    // No user logged in, redirect to login page
    window.location.href = "/web-design-project-group-19/pages/html/login-signup-page.html";
  } else {
    // User is logged in, load profile data
    loadUserProfile(user.uid);
  }
});

// Load user profile data
function loadUserProfile(userId) {
  db.collection("users")
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();

        // Update profile info
        usernameProfile.textContent = userData.displayName || "Anonymous";
        userBio.textContent = userData.bio || "No bio yet.";
        reviewCount.textContent = userData.reviews || 0;
        followerCount.textContent = userData.followers || 0;
        followingCount.textContent = userData.following || 0;

        // Set profile picture
        if (userData.profileImage && userData.profileImage !== "default") {
          profilePicture.src = userData.profileImage;
        } else {
          profilePicture.src = "/web-design-project-group-19/web-design-project-group-19/pages/assets/profile-img/ponyo.jpg";
        }

        // Format join date
        if (userData.createdAt) {
          const date = userData.createdAt.toDate();
          joinDate.textContent = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      }
    })
    .catch((err) => {
      console.error("Error getting document:", err);
    });
}

// Function to update profile image URL if you want users to provide external URLs
function updateProfileImage(imageUrl) {
  db.collection("users")
    .doc(auth.currentUser.uid)
    .update({
      profileImage: imageUrl,
    })
    .then(() => {
      profilePicture.src = imageUrl;
    })
    .catch((err) => {
      console.error("Error updating profile image:", err);
    });
}

if (editBioBtn) {
  editBioBtn.addEventListener("click", () => {
    const currentBio = userBio.textContent;

    // Prevent multiple editors
    if (document.querySelector(".edit-bio")) return;

    // Create wrapper for editing
    const editBioDiv = document.createElement("div");
    editBioDiv.className = "edit-bio";

    // Textarea for editing
    const textarea = document.createElement("textarea");
    textarea.value = currentBio;
    textarea.rows = 4;
    textarea.cols = 40;

    // Buttons
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.className = "save-bio";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "cancel-bio";

    // Add to DOM
    editBioDiv.appendChild(textarea);
    editBioDiv.appendChild(saveBtn);
    editBioDiv.appendChild(cancelBtn);

    // Hide original and show editor
    userBio.style.display = "none";
    editBioBtn.style.display = "none";
    userBio.parentNode.insertBefore(editBioDiv, userBio.nextSibling);

    // Save handler
    saveBtn.addEventListener("click", () => {
      const newBio = textarea.value.trim();

      if (!newBio) return;

      db.collection("users")
        .doc(auth.currentUser.uid)
        .update({ bio: newBio })
        .then(() => {
          userBio.textContent = newBio;
          editBioDiv.remove();
          userBio.style.display = "block";
          editBioBtn.style.display = "block";
        })
        .catch((err) => {
          console.error("Error saving bio:", err);
        });
    });

    // Cancel handler
    cancelBtn.addEventListener("click", () => {
      editBioDiv.remove();
      userBio.style.display = "block";
      editBioBtn.style.display = "block";
    });
  });
}
