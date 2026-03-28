const API_URL = "https://herathonbackend.onrender.com";

// Load toast notification system
const toastScript = document.createElement('script');
toastScript.src = 'toast.js';
document.head.appendChild(toastScript);

// Simple check that the script is actually running
window.addEventListener("load", () => {
  console.log("frontend script loaded");
});

async function register() {
  try {
    console.log("register() clicked");
    const statusEl = document.getElementById("status");
    if (statusEl) statusEl.textContent = "";

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    const role = document.getElementById("role").value;

    if (!name || !email || !password || !passwordConfirm) {
      const msg = "Please fill in all fields.";
      if (statusEl) statusEl.textContent = msg;
      showError(msg);
      return;
    }

    if (password !== passwordConfirm) {
      const msg = "Passwords do not match.";
      if (statusEl) statusEl.textContent = msg;
      showError(msg);
      return;
    }

    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    });

    console.log("register() response status", res.status);
    const data = await res.json();
    console.log("register() response body", data);

    if (statusEl) statusEl.textContent = data.message || "Register request sent";
    showSuccess(data.message || "Register request sent");
  } catch (err) {
    console.error("register() error", err);
    const statusEl = document.getElementById("status");
    if (statusEl) statusEl.textContent = "Register failed: " + err.message;
    showError("Register failed: " + err.message);
  }
}

async function getChallenges() {
  try {
    const res = await fetch(`${API_URL}/challenges`);
    const data = await res.json();

    const list = document.getElementById("challengeList");
    list.innerHTML = "";

    const userLevel = 1; // TEMP
    const userId = localStorage.getItem("userId");

    data.forEach((challenge) => {
      const li = document.createElement("li");

      if (challenge.level > userLevel) {
        li.textContent = `🔒 ${challenge.title} (Level ${challenge.level})`;
        li.style.opacity = "0.5";
      } else {
        li.innerHTML = `
          ${challenge.title} (Level ${challenge.level})
          <button onclick="completeChallenge('${challenge._id}')">Complete</button>
        `;
      }

      list.appendChild(li);
    });
  } catch (err) {
    showError("Failed to load challenges: " + err.message);
  }
}

async function login() {
  try {
    console.log("login() clicked");
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const statusEl = document.getElementById("loginStatus");

    if (statusEl) statusEl.textContent = "";

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("login() response status", res.status);
    const data = await res.json();
    console.log("login() response body", data);

    if (!res.ok) {
      const msg = data.message || "Login failed";
      if (statusEl) statusEl.textContent = msg;
      showError(msg);
      return;
    }

    // Save token and role for later use
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("name", data.user.name);
    localStorage.setItem("userId", data.user.id);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (statusEl) statusEl.textContent = "Login successful! Redirecting to dashboard...";

    // Redirect directly to dashboard
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
  } catch (err) {
    console.error("login() error", err);
    const statusEl = document.getElementById("loginStatus");
    if (statusEl) statusEl.textContent = "Login failed: " + err.message;
    showError("Login failed: " + err.message);
  }
}

async function getTeams() {
  try {
    const res = await fetch(`${API_URL}/teams`);
    const data = await res.json();

    const list = document.getElementById("teamList");
    list.innerHTML = "";

    data.forEach((team) => {
      const li = document.createElement("li");
      li.textContent = `${team.name} (${team.members} members)`;
      list.appendChild(li);
    });
  } catch (err) {
    showError("Failed to load teams: " + err.message);
  }
}

async function completeChallenge(id) {
  const userId = localStorage.getItem("userId");

  await fetch(`${API_URL}/challenges/complete/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId })
  });

  showSuccess("Challenge completed!");
  getChallenges();
}