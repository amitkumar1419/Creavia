const STORAGE_KEY = 'blockedNumbers';
const BLOCK_ALL_KEY = 'blockAll';

function getBlockedNumbers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveBlockedNumbers(numbers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(numbers));
}

function isBlockAllEnabled() {
  return localStorage.getItem(BLOCK_ALL_KEY) === "true";
}

function blockNumber() {
  const number = document.getElementById("block-number").value.trim();

  if (!number.startsWith("+")) {
    alert("Use international format like +911234567890");
    return;
  }

  const blocked = getBlockedNumbers();

  if (isBlockAllEnabled()) {
    alert("Already blocked (All Block mode is ON).");
    return;
  }

  if (!blocked.includes(number)) {
    blocked.push(number);
    saveBlockedNumbers(blocked);
    alert(`${number} blocked.`);
  } else {
    alert("Number already blocked.");
  }
}

function unblockNumber() {
  const number = document.getElementById("unblock-number").value.trim();
  let blocked = getBlockedNumbers();
  let wasBlocked = false;

  // Remove from manual blocked list
  if (blocked.includes(number)) {
    blocked = blocked.filter(n => n !== number);
    wasBlocked = true;
  }

  // Unblock All if it was enabled
  if (isBlockAllEnabled()) {
    localStorage.removeItem(BLOCK_ALL_KEY);
    wasBlocked = true;
  }

  saveBlockedNumbers(blocked);

  if (wasBlocked) {
    alert(`${number} unblocked. All blocks removed.`);
  } else {
    alert("Number not found in block list.");
  }
}

function blockAll() {
  localStorage.setItem(BLOCK_ALL_KEY, "true");
  alert("All numbers are now blocked.");
}

function unblockAll() {
  localStorage.removeItem(BLOCK_ALL_KEY);
  localStorage.removeItem(STORAGE_KEY); // Also clear manual blocks
  alert("Unblocked all numbers.");
}

function goBack() {
  location.href = "profile.html";
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
