document.addEventListener("DOMContentLoaded", () => {
  // Load user data (username, email)
  document.getElementById("user-name").value = localStorage.getItem("userName") || "User";
  document.getElementById("user-name-display").textContent = localStorage.getItem("userName") || "User";
  document.getElementById("user-email").textContent = localStorage.getItem("userEmail") || "No Email";
  document.getElementById("weather-notification").checked = localStorage.getItem("weatherNotification") === "true";

  // If notification toggle is ON, fetch weather
  if (document.getElementById("weather-notification").checked) {
    requestLocationPermission();
  }
});

// Save username
document.getElementById("save-username").addEventListener("click", () => {
  const newUsername = document.getElementById("user-name").value;
  localStorage.setItem("userName", newUsername);
  document.getElementById("user-name-display").textContent = newUsername;
});

// Notification toggle
document.getElementById("weather-notification").addEventListener("change", (event) => {
  const isChecked = event.target.checked;
  localStorage.setItem("weatherNotification", isChecked);

  if (isChecked) {
    requestLocationPermission();
  } else {
    document.getElementById('weather-message').innerText = "";
    document.getElementById('song-suggestion').innerText = "";
  }
});

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});

// Request Location Permission
function requestLocationPermission() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherData(lat, lon);
      },
      function (error) {
        if (error.code === error.PERMISSION_DENIED) {
          alert("Location access denied. Please enable it from your browser settings.");
          document.getElementById("weather-message").innerText = "Location is required for weather updates.";
        } else {
          alert("Location error: " + error.message);
        }
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Fetch weather data
function fetchWeatherData(lat, lon) {
  const apiKey = '996917337c2cbfbbae5a4724608b5f51'; // Replace with your API key
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(apiURL)
    .then(res => res.json())
    .then(data => {
      const weather = data.weather[0].main.toLowerCase(); // like 'clear', 'rain', etc
      const temp = data.main.temp;
      const locationName = `${data.name}, ${data.sys.country}`; // e.g., Delhi, IN
      displayWeatherMessage(weather, temp, locationName);
    })
    .catch(err => console.error("Weather fetch error:", err));
}

// Display weather and random song suggestion
function displayWeatherMessage(weather, temp, locationName) {
  const message = `Right now it's ${weather} with ${temp}°C in ${locationName}.`;
  document.getElementById('weather-message').innerText = message;

  // Weather-wise song suggestions
  const songs = {
    clear: [
      { title: "Walking On Sunshine", url: "https://www.youtube.com/watch?v=iPUmE-tne5U" },
      { title: "Uptown Funk", url: "https://www.youtube.com/watch?v=OPf0YbXqDm0" },
      { title: "Sugar - Maroon 5", url: "https://www.youtube.com/watch?v=09R8_2nJtjg" }
    ],
    rain: [
      { title: "Tum Se Hi", url: "https://www.youtube.com/watch?v=of5RXG6r64g" },
      { title: "Raabta", url: "https://www.youtube.com/watch?v=0zPywiFI__k" },
      { title: "Barish - Half Girlfriend", url: "https://www.youtube.com/watch?v=Q9sC2kfcLNw" }
    ],
    clouds: [
      { title: "Clouds - NF", url: "https://www.youtube.com/watch?v=tsmPCcHNFv4" },
      { title: "A Sky Full of Stars", url: "https://www.youtube.com/watch?v=VPRjCeoBqrI" },
      { title: "Cloudy Day - Tones And I", url: "https://www.youtube.com/watch?v=3cnQCk0u49w" }
    ],
    snow: [
      { title: "Let It Go - Frozen", url: "https://www.youtube.com/watch?v=L0MK7qz13bU" },
      { title: "Sweater Weather - The Neighbourhood", url: "https://www.youtube.com/watch?v=GCdwKhTtNNw" },
      { title: "Cold Water - Major Lazer", url: "https://www.youtube.com/watch?v=a59gmGkq_pw" }
    ],
    default: [
      { title: "Phir Le Aaya Dil", url: "https://www.youtube.com/watch?v=FZC5q8FzS3I" },
      { title: "Perfect - Ed Sheeran", url: "https://www.youtube.com/watch?v=2Vv-BfVoq4g" },
      { title: "All Of Me - John Legend", url: "https://www.youtube.com/watch?v=450p7goxZqg" }
    ]
  };

  let selectedSongs;
  if (songs[weather]) {
    selectedSongs = songs[weather];
  } else {
    selectedSongs = songs.default;
  }

  // Pick random song
  const randomSong = selectedSongs[Math.floor(Math.random() * selectedSongs.length)];

  // Display song suggestion
  const songText = document.getElementById('song-suggestion');
  songText.innerHTML = `Song Suggestion: <a href="${randomSong.url}" target="_blank">${randomSong.title}</a>`;

  // Also show a sweet alert
  alert(`${message}\nEnjoy this song: ${randomSong.title}`);
}
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
