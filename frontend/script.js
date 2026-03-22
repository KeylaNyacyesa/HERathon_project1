const API_URL = "http://localhost:5000";

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
      alert(msg);
      return;
    }

    if (password !== passwordConfirm) {
      const msg = "Passwords do not match.";
      if (statusEl) statusEl.textContent = msg;
      alert(msg);
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
    alert(data.message || "Register request sent");
  } catch (err) {
    console.error("register() error", err);
    const statusEl = document.getElementById("status");
    if (statusEl) statusEl.textContent = "Register failed: " + err.message;
    alert("Register failed: " + err.message);
  }
}

async function getChallenges() {
  try {
    const res = await fetch(`${API_URL}/challenges`);
    const data = await res.json();

    const list = document.getElementById("challengeList");
    list.innerHTML = "";

    data.forEach((challenge) => {
      const li = document.createElement("li");
      li.textContent = challenge.title + " - Level " + challenge.level;
      list.appendChild(li);
    });
  } catch (err) {
    alert("Failed to load challenges: " + err.message);
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
      alert(msg);
      return;
    }

    // Save token and role for later use
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("name", data.user.name);

    if (statusEl) statusEl.textContent = "Login successful";

    const dashboard = document.getElementById("dashboard");
    const currentRole = document.getElementById("currentRole");
    if (dashboard) dashboard.style.display = "block";
    if (currentRole) currentRole.textContent = `${data.user.role} (${data.user.name})`;

    // Load some initial data depending on role
    await getChallenges();
    await getTeams();
  } catch (err) {
    console.error("login() error", err);
    const statusEl = document.getElementById("loginStatus");
    if (statusEl) statusEl.textContent = "Login failed: " + err.message;
    alert("Login failed: " + err.message);
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
    alert("Failed to load teams: " + err.message);
  }
}