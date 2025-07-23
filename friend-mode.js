import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDN7sfj608VAXWN9PhjLeYxR-tw7_tM2TY",
  authDomain: "weather-emotion-54198.firebaseapp.com",
  databaseURL: "https://weather-emotion-54198-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "weather-emotion-54198",
  storageBucket: "weather-emotion-54198.appspot.com",
  messagingSenderId: "2402131884",
  appId: "1:2402131884:web:cfeaba045137bfd66c6409",
  measurementId: "G-7EV72BBKC2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
auth.useDeviceLanguage();

// reCAPTCHA Setup
let recaptchaVerifier;
window.onload = () => {
  recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    size: 'invisible',
    callback: () => console.log("reCAPTCHA solved!")
  }, auth);
  recaptchaVerifier.render();
};

let confirmationResult = null;
let currentUserUID = null;

// DOM Elements
const yourNumber = document.getElementById("your-number");
const verifyBtn = document.getElementById("verify-btn");
const otpSection = document.getElementById("otp-section");
const otpInput = document.getElementById("otp");
const verifyOtpBtn = document.getElementById("verify-otp");
const friendNumber = document.getElementById("friend-number");
const confirmnumber = document.getElementById("Confirm-friend-number");
const friendnamesection = document.getElementById("friend-name-section");
const friendname = document.getElementById("friend-name");
const friendlocationsection = document.getElementById("friend-location-section");
const friendlocation = document.getElementById("friend-location");
const relation = document.getElementById("relation");
const advancedMode = document.getElementById("advanced-mode");
const advancedFields = document.getElementById("advanced-fields");
const disableSend = document.getElementById("disable-send");
const friendSafe = document.getElementById("friend-safe");
const sendBtn = document.getElementById("send-msg-btn");
const requestPermissionBtn = document.getElementById("request-permission");

const OPEN_WEATHER_API_KEY = "9bbddb493d288d7ac3c813d339be9baa";
const defaultSongUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

// Weather API Fetch
async function fetchWeather(location) {
  const url = https//api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${OPEN_WEATHER_API_KEY}&units=metric;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch weather");
    const data = await response.json();
    return {
      main: data.weather[0].main,
      description: data.weather[0].description,
      temp: data.main.temp,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Get Sweet Message Based on Weather
function getSweetMessage(weatherMain) {
  switch (weatherMain.toLowerCase()) {
    case "rain":
    case "rainy":
      return "Hey! It's raining there. Don't forget your umbrella ☔!";
    case "clear":
      return "It's a bright and sunny day! Stay happy and smile 😊";
    case "clouds":
    case "cloudy":
      return "Cloudy skies above, but your smile brightens the day ☁😊";
    case "snow":
      return "Snowfall magic is happening! Keep warm and cozy ❄";
    default:
      return "Hope you're having a wonderful day!";
  }
}

// Save Friend Data to Firebase
async function saveFriendData() {
  if (!currentUserUID) {
    alert("User not authenticated!");
    return false;
  }

  const friendData = {
    number: friendNumber.value.trim(),
    name: friendname.value.trim(),
    location: friendlocation.value.trim(),
    relation: relation.value,
    advancedMode: advancedMode.checked,
    disableSend: disableSend.checked,
    friendSafe: friendSafe.checked,
  };

  if (!friendData.number || !friendData.name || !friendData.location) {
    alert("Please fill all friend details!");
    return false;
  }

  try {
    await set(ref(db,` users/${currentUserUID}/friends/${friendData.number}`), {
      ...friendData,
      lastWeather: null
    });

    alert("Friend data saved successfully!");
    return true;
  } catch (err) {
    alert("Error saving friend data: " + err.message);
    return false;
  }
}

// 🔁 Updated Instant Notify Function
async function instantNotify(friendData) {
  const weather = await fetchWeather(friendData.location);
  if (!weather) return;

  const message = getSweetMessage(weather.main);
  const finalMessage = `${message}\n\nWeather: ${weather.main}, ${weather.description}, Temp: ${weather.temp}°C\nListen to this: ${defaultSongUrl}`;

  if (Notification.permission !== "granted") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("❌ You denied notification permission.");
      return;
    }
  }

  const notification = new Notification(`Weather update for ${friendData.name}`, {
    body: finalMessage,
    icon: "https://cdn-icons-png.flaticon.com/512/1116/1116453.png",
    tag: friendData.number
  });

  notification.onclick = () => {
    const whatsappURL = https://wa.me/${friendData.number.replace(/\D/g, "")}?text=${encodeURIComponent(finalMessage)};
    window.open(whatsappURL, "_blank");
    notification.close();
  };

  await set(ref(db, `users/${currentUserUID}/friends/${friendData.number}/lastWeather)`, weather));
}

// Phone Auth OTP Handling
verifyBtn.addEventListener("click", () => {
  const phoneNumber = yourNumber.value.trim();
  if (!phoneNumber.startsWith("+")) return alert("Please enter a valid phone number with country code (e.g., +91)");

  signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
    .then((result) => {
      confirmationResult = result;
      otpSection.style.display = "block";
      alert("OTP sent to " + phoneNumber);
    })
    .catch((error) => {
      alert("Failed to send OTP: " + error.message);
    });
});

verifyOtpBtn.addEventListener("click", () => {
  const otp = otpInput.value.trim();
  if (!otp) return alert("Please enter the OTP");

  confirmationResult.confirm(otp)
    .then((result) => {
      alert("Phone number verified successfully!");
      currentUserUID = result.user.uid;

      [friendNumber, friendname, friendlocation, relation, advancedMode, disableSend, friendSafe, sendBtn].forEach(el => el.disabled = false);
    })
    .catch((error) => {
      alert("OTP verification failed: " + error.message);
    });
});

confirmnumber.addEventListener("click", () => {
  friendnamesection.style.display = "block";
  friendlocationsection.style.display = "block";
});

advancedMode.addEventListener("change", () => {
  advancedFields.style.display = advancedMode.checked ? "block" : "none";
});

sendBtn.addEventListener("click", async () => {
  const success = await saveFriendData();
  if (!success) return;

  const friendData = {
    number: friendNumber.value.trim(),
    name: friendname.value.trim(),
    location: friendlocation.value.trim(),
    relation: relation.value,
    advancedMode: advancedMode.checked,
    disableSend: disableSend.checked,
    friendSafe: friendSafe.checked,
  };

  instantNotify(friendData);
});

requestPermissionBtn.addEventListener("click", async () => {
  if (!("Notification" in window)) {
    alert("❌ Notifications are not supported in your browser.");
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      alert("✅ Notification permission granted!");
    } else if (permission === "denied") {
      alert("❌ You denied notification permission.");
    } else {
      alert("⚠ Notification permission dismissed.");
    }
  } catch (err) {
    console.error("Notification error:", err);
    alert("⚠ Error requesting notification permission.");
  }
});
