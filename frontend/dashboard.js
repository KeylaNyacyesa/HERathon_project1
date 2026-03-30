const API_URL = "https://herathonbackend.onrender.com";

async function loadDashboard() {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) {
    window.location.href = "index.html";
    return;
  }

  const user = JSON.parse(userStr);
  const role = user.role || "student";

const userNameEl = document.getElementById("name") || document.getElementById("userName");
  if (userNameEl) userNameEl.textContent = user.name;

  const pageHeader = document.querySelector(".page-header");
  const gamificationPanel = document.querySelector(".gamification-panel");
  const topicTree = document.querySelector(".topic-tree");
  let mentorDashboard = document.getElementById("mentorDashboard");

  if (role === "student") {
    if (gamificationPanel) gamificationPanel.style.display = "block";
    if (topicTree) topicTree.style.display = "block";
    if (mentorDashboard) mentorDashboard.style.display = "none";

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 500) {
          localStorage.clear();
          window.location.href = "index.html";
          return;
        }
      } else {
        const liveUserResp = await res.json();
        const liveUser = liveUserResp.user;
        
        // Update user data locally just in case
        localStorage.setItem("user", JSON.stringify(liveUser));
        
        const pts = liveUser.points || 0;
        const lvl = liveUser.level || 1;

        const userLevelEl = document.getElementById("level") || document.getElementById("userLevel");
        if(userLevelEl) userLevelEl.textContent = lvl;
        
        const userPointsEl = document.getElementById("points") || document.getElementById("userPoints");
        if(userPointsEl) userPointsEl.textContent = pts;
        
        const badgesEl = document.getElementById("badges");
        if(badgesEl) {
          if (pts >= 600) {
            badgesEl.textContent = "Pro Player 🏆";
            badgesEl.style.color = "gold";
          } else if (pts >= 300) {
            badgesEl.textContent = "Intermediate 🥈";
            badgesEl.style.color = "silver";
          } else if (pts >= 150) {
            badgesEl.textContent = "Beginner 🥉";
            badgesEl.style.color = "#cd7f32"; // Bronze
          } else {
            badgesEl.textContent = "None yet";
          }
        }
        
        const xpPercent = (pts % 100) + "%";
        const xpFillEl = document.getElementById("progressFill") || document.getElementById("xpFill");
        if(xpFillEl) xpFillEl.style.width = xpPercent;
      }
    } catch(err) {
      console.error("Dashboard fetch err", err);
    }
    
    if(typeof loadMyChallenges === 'function') loadMyChallenges(token);

  } else if (role === "mentor") {
    if (pageHeader) pageHeader.style.display = "none";
    if (gamificationPanel) gamificationPanel.style.display = "none";
    if (topicTree) topicTree.style.display = "none";

    const dashboardContainer = document.getElementById("dashboardContent") || document.querySelector(".dashboard-container") || document.body;
    let mentorStatsHtml = `
      <div id="mentorDashboard" style="padding: 2rem;">
        <h2>Welcome back, ${user.name} &mdash; Mentor Dashboard</h2>
        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
          <div class="card" style="padding: 1.5rem; text-align: center; flex: 1;">
            <h3>Pending Submissions</h3>
            <h1 id="pendingCount">Loading...</h1>
            <a href="submissions-review.html" class="btn-primary" style="display:inline-block; margin-top:1rem;">Review Submissions</a>
          </div>
          <div class="card" style="padding: 1.5rem; text-align: center; flex: 1;">
            <h3>Submissions Reviewed</h3>
            <h1 id="reviewedCount">Loading...</h1>
          </div>
        </div>
      </div>
    `;

    if (!mentorDashboard) {
      dashboardContainer.insertAdjacentHTML("afterbegin", mentorStatsHtml);
    } else {
      mentorDashboard.style.display = "block";
    }

    try {
      const res = await fetch(`${API_URL}/submissions`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const submissions = await res.json();
      
      const pendingCount = submissions.filter(s => s.status === "pending" || s.status === "Under Review").length;
      const reviewedCount = submissions.filter(s => s.status === "approved" || s.status === "rejected").length;
      
      document.getElementById("pendingCount").textContent = pendingCount;
      document.getElementById("reviewedCount").textContent = reviewedCount;
    } catch (err) {
      console.error("Error fetching mentor stats:", err);
      const pc = document.getElementById("pendingCount");
      if(pc) pc.textContent = "Error";
    }

  } else if (role === "admin") {
     const dashboardContainer = document.getElementById("dashboardContent") || document.querySelector(".dashboard-container") || document.body;
     dashboardContainer.innerHTML = `
        <div style="padding: 2rem;">
          <h2>Admin Panel</h2>
          <p>Welcome, ${user.name}. Navigate using the menu.</p>
        </div>
     `;
  }
}

document.addEventListener("DOMContentLoaded", loadDashboard);
