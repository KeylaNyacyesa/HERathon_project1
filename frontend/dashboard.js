const API_URL = "https://herathonbackend.onrender.com";
const token = localStorage.getItem("token");

// Load toast notification system
const toastScript = document.createElement('script');
toastScript.src = 'toast.js';
document.head.appendChild(toastScript);

window.addEventListener("load", async () => {
  await loadDashboard();
});

async function loadDashboard() {
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name") || "User";
  const currentRoleEl = document.getElementById("currentRole");
  
  // Update profile button with user's name
  const userNameNav = document.getElementById("userNameNav");
  if (userNameNav) {
    userNameNav.textContent = name;
  }

  if (currentRoleEl) {
    let welcomeText = "Student";
    if (role === "admin") welcomeText = "Admin";
    else if (role === "mentor") welcomeText = "Mentor";
    currentRoleEl.textContent = `${welcomeText} (${name})`;
  }

  // Role-based dashboard rendering
  renderRoleDashboard(role);
}

async function renderRoleDashboard(role) {
  // Only check topics/profile setup for STUDENTS
  if (role === "student") {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/users/setup-status`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const setup = await res.json();
    
    if (!setup.hasTopics) {
      window.location.href = "select-topics.html";
      return;
    }
    
    if (!setup.profileComplete) {
      window.location.href = "profile.html?required=true";
      return;
    }
  }
  
  const dashboardContent = document.getElementById("dashboardContent");

  // Load profile data for gamification
  try {
    const profileRes = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const profile = await profileRes.json();
    
    document.getElementById("name").textContent = profile.user.name;
    document.getElementById("level").textContent = profile.user.level || 1;
    document.getElementById("points").textContent = profile.user.points || 0;
    document.getElementById("badges").textContent = (profile.user.badges || []).join(", ") || "None";
    updateProgress(profile.user);
  } catch (err) {
    console.error("Profile load:", err);
  }

  // Render role-specific content
  if (role === "student") {
    renderStudentDashboard();
  } else if (role === "mentor") {
    renderMentorDashboard();
  } else if (role === "admin") {
    renderAdminDashboard();
  }
}

async function renderStudentDashboard() {
  const topicTree = document.getElementById("topicTree");
  await renderTopicTree();

  // Add quick links for student features
  const dashboardContent = document.getElementById("dashboardContent");
  const quickLinksHTML = `
    <div class="panel" style="margin-top: 2rem;">
      <h3 style="color: var(--primary); margin-bottom: 1rem;">🚀 Quick Actions</h3>
      <div class="nav-grid" style="margin-top: 0;">
        <a href="teams.html" class="nav-card">
          <h3>👥 Teams</h3>
        </a>
        <a href="scholarships.html" class="nav-card" style="border-left: 4px solid var(--success);">
          <h3 style="color: var(--success);">🎓 Scholarships</h3>
        </a>
        <a href="mentorship.html" class="nav-card" style="border-left: 4px solid var(--warning);">
          <h3 style="color: var(--warning);">🧑‍🏫 Mentors</h3>
        </a>
      </div>
    </div>
  `;
  dashboardContent.insertAdjacentHTML('beforeend', quickLinksHTML);
}

const topicsData = {
  'Mathematics': ['Calculus', 'Algebra', 'Geometry', 'Statistics'],
  'Biology': ['Cell Biology & Molecular Biology', 'Genetics & Heredity', 'Ecology & Environment', 'Bioenergetics'],
  'Chemistry': ['Atomic Structure & Properties', 'Bonding & Molecular Structure', 'Chemical Reactions & Stoichiometry', 'Organic Chemistry', 'Reaction Kinetics & Equilibrium'],
  'Physics': ['Classical Mechanics', 'Thermodynamics & Statistical Mechanics', 'Electromagnetism', 'Optics', 'Waves and Vibrations', 'Quantum Mechanics', 'Relativity'],
  'Computer Science': ['Algorithms and Data Structures', 'Programming Languages', 'Computer Architecture', 'Operating Systems', 'Database Management Systems', 'Computer Networks']
};

async function renderTopicTree() {
  const token = localStorage.getItem('token');
  try {
    // Fetch profile
    const profileRes = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const profile = await profileRes.json();
    const user = profile.user;
    
    // Fetch all challenges with status
    const challengesRes = await fetch(`${API_URL}/challenges`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const challenges = await challengesRes.json();
    
    // Group challenges by course > topic
    const courseMap = new Map();
    if (challenges && challenges.length > 0) {
      challenges.forEach(ch => {
        const course = ch.course || 'General';
        const topic = ch.topic || 'General';
        if (!courseMap.has(course)) courseMap.set(course, new Map());
        const topicMap = courseMap.get(course);
        if (!topicMap.has(topic)) topicMap.set(topic, { total: 0, completed: 0 });
        const stats = topicMap.get(topic);
        stats.total += 1;
        if (ch.status === 'completed') stats.completed += 1;
      });
    }
    
    let treeHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="margin: 0; color: var(--text-main);">Your Selected Courses & Topics</h2>
        <a href="select-courses.html" class="btn-link" style="padding: 0.5rem 1rem; font-size: 0.9rem;">+ Edit Courses</a>
      </div>
    `;
    courseMap.forEach((topicMap, course) => {
      let courseProgress = 0;
      let totalTopics = 0;
      let html = `<section class="panel course-section">
        <h3>${course}</h3>
        <div class="course-topics">`;
      
      topicMap.forEach((stats, topic) => {
        const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
        courseProgress += stats.completed;
        totalTopics ++;
        html += `
          <div class="topic-row">
            <a href="challenges.html?topic=${encodeURIComponent(topic)}" class="topic-link">
              ${topic} → View Challenges
            </a>
            <div class="topic-progress">
              <span>${progress}%</span>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
              </div>
              <small>${stats.completed}/${stats.total} completed</small>
            </div>
          </div>`;
      });
      
      const coursePct = totalTopics > 0 ? Math.round(courseProgress / (courseMap.size * 5) * 100) : 0; // approx
      html += `</div>
        <div class="course-progress">Course Progress: ${coursePct}%</div>
      </section>`;
      treeHTML += html;
    });
    
    if (courseMap.size === 0) {
      if (user.topics && user.topics.length > 0) {
        treeHTML = `<p class="no-topics">You have selected ${user.topics.length} topic(s), but there are no challenges available yet. Check back soon or contact an Admin!</p>`;
      } else {
        treeHTML = '<p class="no-topics">No topics selected yet. <a href="select-topics.html">Choose your topics</a></p>';
      }
    }
    
    document.getElementById('topicTree').innerHTML = treeHTML;
  } catch (err) {
    console.error('Tree load error:', err);
    document.getElementById('topicTree').innerHTML = '<p>Error loading tree. <button onclick="renderTopicTree()">Retry</button></p>';
  }
}

function updateProgress(user) {
  const nextLevelPoints = user.level * 100;
  const progress = Math.min((user.points / nextLevelPoints) * 100, 100);
  document.getElementById("progressFill").style.width = `${progress}%`;
}

// Student challenge loader with status
async function loadStudentChallenges() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/challenges?userId=${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const challenges = await res.json();

  const list = document.getElementById("challengeList");
  list.innerHTML = "";
  challenges.forEach(challenge => {
    const li = document.createElement("li");
    let statusIcon = "";
    if (challenge.status === "completed") statusIcon = "✅";
    else if (challenge.status === "locked") statusIcon = "🔒";
    else statusIcon = "🔓";

    li.innerHTML = `${statusIcon} ${challenge.title} (Lv${challenge.level}) 
      ${challenge.status !== "completed" && challenge.status !== "locked" ? `<button onclick="completeChallenge('${challenge._id}')">Complete</button>` : ''}`;
    list.appendChild(li);
  });
}

async function loadMySubmissions() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/submissions/my`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const submissions = await res.json();

  // Update medal summary if exists
  const medalsEl = document.getElementById("medalSummary");
  if (medalsEl) {
    const gold = submissions.filter(s => s.medal === "gold").length;
    const silver = submissions.filter(s => s.medal === "silver").length;
    const bronze = submissions.filter(s => s.medal === "bronze").length;
    medalsEl.innerHTML = `🥇${gold} 🥈${silver} 🥉${bronze}`;
  }

  const list = document.getElementById("submissionList");
  list.innerHTML = "";
  submissions.forEach(sub => {
    const medalIcon = sub.medal === "gold" ? "🥇" : sub.medal === "silver" ? "🥈" : sub.medal === "bronze" ? "🥉" : "⚪";
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${sub.challengeId?.title || 'Challenge'}</strong> 
      <span class="medal-${sub.medal}">${medalIcon} (${sub.attempts || 1} attempts)</span>
      - ${sub.status} 
      ${sub.feedback ? `<br><small>${sub.feedback}</small>` : ''}
    `;
    list.appendChild(li);
  });
}


async function loadScholarships() {
  const res = await fetch(`${API_URL}/scholarships`);
  const scholarships = await res.json();
  const list = document.getElementById("scholarshipList");
  list.innerHTML = "";
  scholarships.forEach(sch => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${sch.name}</strong> - ${sch.description || ''}<br><small>Deadline: ${sch.deadline}</small>`;
    list.appendChild(li);
  });
}

async function loadNotifications() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const notifs = await res.json();
  const list = document.getElementById("notificationList");
  list.innerHTML = "";
  notifs.forEach(n => {
    const li = document.createElement("li");
    li.textContent = `[${n.type}] ${n.message}`;
    list.appendChild(li);
  });
}

async function loadMyMentorships() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/mentors/my-mentorships`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const mentorships = await res.json();
  const list = document.getElementById("mentorshipList");
  list.innerHTML = "";
  mentorships.forEach(m => {
    const li = document.createElement("li");
    li.textContent = `Status: ${m.status} (${m.topic || 'General'})`;
    list.appendChild(li);
  });
}

async function renderMentorDashboard() {
  const dashboard = document.getElementById("dashboardContent");
  
  // Hide student items
  const topicTree = document.getElementById("topicTree");
  if (topicTree) topicTree.style.display = "none";
  const gamification = document.getElementById("gamification");
  if (gamification) gamification.style.display = "none";

  dashboard.innerHTML = `
    <div class="mentor-panel">
      <h2>👨‍🏫 Mentor Dashboard</h2>
      <div class="mentor-quick-links">
        <a href="submissions-review.html" class="btn-link">📋 Review Student Submissions</a>
      </div>
      
      <div class="mentor-stats">
        <h3>My Students</h3>
        <button onclick="loadMyStudents()">Load Students</button>
        <ul id="studentList"></ul>
      </div>
    </div>
  `;
  
  await loadMyStudents();
}

async function loadMyStudents() {
  const token = localStorage.getItem("token");
  const list = document.getElementById("studentList");
  
  try {
    const res = await fetch(`${API_URL}/submissions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const submissions = await res.json();
    
    // Get unique student names from submissions
    const studentMap = new Map();
    submissions.forEach(sub => {
      if (sub.userId && sub.userId._id) {
        studentMap.set(sub.userId._id, {
          name: sub.userId.name,
          level: sub.userId.level,
          submissions: (studentMap.get(sub.userId._id)?.submissions || 0) + 1
        });
      }
    });
    
    list.innerHTML = "";
    if (studentMap.size === 0) {
      list.innerHTML = "<li>No students found</li>";
      return;
    }
    
    studentMap.forEach(student => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${student.name}</strong> (Level ${student.level}) - ${student.submissions} submissions`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading students:", err);
    list.innerHTML = "<li>Error loading students</li>";
  }
}

async function loadSubmissionsReview() {
  const token = localStorage.getItem("token");
  const status = document.getElementById("statusFilter").value;
  const url = status ? `${API_URL}/submissions?status=${status}` : `${API_URL}/submissions`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const submissions = await res.json();
  const list = document.getElementById("reviewList");
  list.innerHTML = "";
  submissions.forEach(sub => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${sub.userId.name}</strong> - ${sub.challengeId.title}<br>
      Status: ${sub.status} | <input id="feedback-${sub._id}" placeholder="Feedback">
      <button onclick="reviewSubmission('${sub._id}', 'Approved')">Approve</button>
      <button onclick="reviewSubmission('${sub._id}', 'Rejected')">Reject</button>
    `;
    list.appendChild(li);
  });
}

async function reviewSubmission(id, status) {
  const token = localStorage.getItem("token");
  const feedback = document.getElementById(`feedback-${id}`).value;
  await fetch(`${API_URL}/submissions/${id}/review`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status, feedback })
  });
  loadSubmissionsReview();
}

async function renderAdminDashboard() {
  const dashboard = document.getElementById("dashboardContent");

  // Hide student items
  const topicTree = document.getElementById("topicTree");
  if (topicTree) topicTree.style.display = "none";
  const gamification = document.getElementById("gamification");
  if (gamification) gamification.style.display = "none";

  dashboard.innerHTML = `
    <div class="admin-stats">
      <h3>Platform Stats</h3>
      <button onclick="loadAdminSummary()">Load Summary</button>
      <div id="summaryStats"></div>
    </div>
    <div class="admin-manage">
      <h3>Management</h3>
      <button onclick="loadUsers()">Users</button>
      <ul id="userList"></ul>
      <h4>Create Challenge</h4>
      <input id="challengeTitle" placeholder="Title">
      <input id="challengeLevel" type="number" placeholder="Level">
      <button onclick="createChallenge()">Create</button>
    </div>
  `;
}

async function loadAdminSummary() {
  const res = await fetch(`${API_URL}/admin/summary`);
  const stats = await res.json();
  const statsDiv = document.getElementById("summaryStats");
  statsDiv.innerHTML = `
    Users: ${stats.users} | Challenges: ${stats.challenges} | Teams: ${stats.teams}<br>
    Scholarships: ${stats.scholarships} | Submissions: ${stats.submissions}
  `;
}

async function loadUsers() {
  const res = await fetch(`${API_URL}/admin/users`);
  const users = await res.json();
  const list = document.getElementById("userList");
  list.innerHTML = "";
  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = `${user.name} (${user.role})`;
    list.appendChild(li);
  });
}

async function createChallenge() {
  const title = document.getElementById("challengeTitle").value;
  const level = document.getElementById("challengeLevel").value;
  await fetch(`${API_URL}/admin/challenges`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, level: parseInt(level), description: "Test challenge" })
  });
  showSuccess("Challenge created!");
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

function toggleProfileMenu() {
  const dropdown = document.getElementById("profileDropdown");
  dropdown.classList.toggle("active");
  
  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".profile-menu")) {
      dropdown.classList.remove("active");
    }
  });
}

async function loadTeams() {
  const res = await fetch(`${API_URL}/teams`);
  const data = await res.json();
  const list = document.getElementById("teamList");
  if (!list) return;
  list.innerHTML = "";
  data.forEach((team) => {
    const li = document.createElement("li");
    li.textContent = `${team.name} (${team.members || 0} members)`;
    list.appendChild(li);
  });
}

async function completeChallenge(id) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_URL}/challenges/complete/${id}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (res.ok) {
      loadStudentChallenges();
      // Reload profile to update gamification
      const profileRes = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      const profile = await profileRes.json();
      document.getElementById("level").textContent = profile.user.level;
      document.getElementById("points").textContent = profile.user.points;
      document.getElementById("badges").textContent = profile.user.badges.join(", ") || "None";
      updateProgress(profile.user);
    }
  } catch (err) {
    showError("Complete error: " + err.message);
  }
}
