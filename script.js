// ✅ Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDN7sfj608VAXWN9PhjLeYxR-tw7_tM2TY",
  authDomain: "weather-emotion-54198.firebaseapp.com",
  projectId: "weather-emotion-54198",
  storageBucket: "weather-emotion-54198.appspot.com",
  messagingSenderId: "2402131884",
  appId: "1:2402131884:web:cfeaba045137bfd66c6409",
  measurementId: "G-7EV72BBKC2"
};
const toggle = document.getElementById('theme-toggle');

toggle.addEventListener('change', function () {
  if (this.checked) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
  }
});

// Optional: Set default theme
document.body.classList.add('light-mode');


// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();

// ✅ Google Login Handler
document.getElementById("google-login").addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      saveUserData(result.user);
      sendWeatherNotification(); // Instant weather notification
    })
    .catch((error) => {
      showErrorMessage(error);
    });
});

// ✅ Setup reCAPTCHA
let recaptchaVerifier;
function setupRecaptcha() {
  recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
    callback: (response) => {
      console.log("reCAPTCHA solved");
    }
  });

  recaptchaVerifier.render().then((widgetId) => {
    window.recaptchaWidgetId = widgetId;
  });
}
setupRecaptcha();

// ✅ Phone Number Login Handler
let confirmationResult;
document.getElementById("send-otp").addEventListener("click", () => {
  const input = document.getElementById("phone-number").value.trim();
  const phoneNumber = input.startsWith("+") ? input : `+${input}`;

  if (!/^\+\d{10,15}$/.test(phoneNumber)) {
    alert("⚠ Enter a valid phone number (e.g., +919876543210).");
    return;
  }

  signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
    .then((result) => {
      confirmationResult = result;
      document.getElementById("otp").style.display = "block";
      document.getElementById("verify-otp").style.display = "block";
      alert("✅ OTP sent successfully!");
    })
    .catch((error) => {
      showErrorMessage(error);
    });
});

// ✅ OTP Verification Handler
document.getElementById("verify-otp").addEventListener("click", () => {
  const otp = document.getElementById("otp").value.trim();
  if (!otp) {
    alert("⚠ Please enter the OTP.");
    return;
  }

  confirmationResult.confirm(otp)
    .then((result) => {
      saveUserData(result.user);
      sendWeatherNotification(); // Instant weather notification
    })
    .catch((error) => {
      showErrorMessage(error);
    });
});

// ✅ Logout
document.getElementById("logout").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("✅ Logged out!");
      localStorage.clear();
      window.location.href = "index.html"; // Safe redirect
    })
    .catch((error) => {
      showErrorMessage(error);
    });
});

// ✅ Save & Redirect
function saveUserData(user) {
  localStorage.setItem("userName", user.displayName || "User");
  localStorage.setItem("userEmail", user.email || "Not Provided");
  localStorage.setItem("userPhoto", user.photoURL || "default-profile.png");

  setTimeout(() => {
    window.location.assign("profile.html"); // Ensure this file exists
  }, 500);
}

// ✅ Load User Data on Profile Page
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("user-name")) {
    document.getElementById("user-name").textContent = localStorage.getItem("userName") || "No Name";
    document.getElementById("user-email").textContent = localStorage.getItem("userEmail") || "No Email";
    document.getElementById("user-photo").src = localStorage.getItem("userPhoto") || "default-profile.png";
  }
});

// ✅ Send Weather Notification (Instant)
function sendWeatherNotification() {
  // Replace this with actual weather fetching API and conditions
  const weatherMessage = " hello bro! The weather today is lovely.";
  const songSuggestion = "How about listening to 'Sunny' by Boney M to match the vibe?";

  const notificationMessage = `${weatherMessage} \n🎶 Song suggestion: ${songSuggestion}`;

  // Show notification or send via preferred method (e.g., alert, push, etc.)
  alert(notificationMessage); // Temporary alert for testing
}

// ✅ Error Handling
function showErrorMessage(error) {
  console.error(error);
  alert("⚠ Error: " + error.message);
}