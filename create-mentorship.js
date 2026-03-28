const fs = require('fs');

const content = \<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mentorship — HERathon</title>
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="toast.css">
</head>
<body>

  <!-- Global nav -->
  <script src="shared-nav.js"></script>

  <div class="page-wrapper">
    
    <div class="page-header">
      <div>
        <h2 class="page-title">🧠 Mentorship</h2>
        <p>Connect with experienced mentors and track your mentorship journey.</p>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- Mentors List -->
      <div class="card" style="grid-column: span 2;">
        <div class="card-title">🌟 Available Mentors</div>
        <div id="mentorsList" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
          <p style="color:var(--text-faint);">Loading mentors...</p>
        </div>
      </div>

      <!-- My Mentorships -->
      <div class="card" style="grid-column: span 2;">
        <div class="card-title">🤝 My Mentorships</div>
        <div id="myMentorships" style="display:flex; flex-direction:column; gap: 1rem;">
          <p style="color:var(--text-faint);">Loading your mentorships...</p>
        </div>
      </div>
    </div>
  </div>

  <script src="toast.js"></script>
  <script>
    const API_URL = "http://localhost:5000";
    
    window.onload = () => {
      loadMentors();
      loadMyMentorships();
    };

    async function loadMentors() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(\\\\\\/mentors/available\\\, {
          headers: { Authorization: \\\Bearer \\\\\\ }
        });
        const list = document.getElementById("mentorsList");
        
        if (!res.ok) throw new Error("Failed to fetch");
        const mentors = await res.json();
        
        list.innerHTML = "";
        
        if (mentors.length === 0) {
            list.innerHTML = "<p style=\\"color:var(--text-muted);\\">No mentors available right now.</p>";
            return;
        }

        mentors.forEach(mentor => {
          const card = document.createElement("div");
          card.style.background = "var(--bg-dark)";
          card.style.padding = "1.5rem";
          card.style.borderRadius = "var(--radius-md)";
          card.style.border = "1px solid var(--border-subtle)";
          
          card.innerHTML = \\\
            <h4 style="margin:0 0 0.5rem; font-size:1.1rem; color:var(--primary-light);">\\\</h4>
            <p style="margin:0 0 1rem; font-size:0.9rem; color:var(--text-muted);">\\\</p>
            <button class="btn-primary" style="width:100%;" onclick="requestMentorship('\\\')">Request Mentor</button>
          \\\;
          list.appendChild(card);
        });
      } catch (err) {
        document.getElementById("mentorsList").innerHTML = "<p style=\\"color:#fca5a5;\\">Failed to load mentors.</p>";
      }
    }

    async function loadMyMentorships() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(\\\\\\/mentors/my-mentorships\\\, {
          headers: { Authorization: \\\Bearer \\\\\\ }
        });
        const list = document.getElementById("myMentorships");
        
        if (!res.ok) throw new Error("Failed to fetch");
        const mentorships = await res.json();
        
        list.innerHTML = "";
        if (mentorships.length === 0) {
            list.innerHTML = "<p style=\\"color:var(--text-muted);\\">You have not requested any mentors yet.</p>";
            return;
        }

        mentorships.forEach(m => {
          const mName = m.mentorId ? m.mentorId.name : "Unknown Mentor";
          const item = document.createElement("div");
          item.style.padding = "1rem";
          item.style.background = "var(--bg-dark)";
          item.style.borderRadius = "var(--radius-sm)";
          item.style.display = "flex";
          item.style.justifyContent = "space-between";
          item.style.alignItems = "center";
          
          item.innerHTML = \\\
             <div>
               <strong style="display:block; margin-bottom:0.25rem;">\\\</strong>
               <span style="font-size:0.85rem; color:var(--text-muted);">Status: <span style="color:var(--primary-light);">\\\</span></span>
             </div>
          \\\;
          list.appendChild(item);
        });
      } catch (err) {
        document.getElementById("myMentorships").innerHTML = "<p style=\\"color:#fca5a5;\\">Failed to load mentorship requests.</p>";
      }
    }

    async function requestMentorship(mentorId) {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(\\\\\\/mentors/request\\\, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: \\\Bearer \\\\\\
          },
          body: JSON.stringify({ mentorId })
        });

        if (res.ok) {
          showSuccess("Mentor request sent!");
          setTimeout(loadMyMentorships, 500);
        } else {
            showError("Could not send request!");
        }
      } catch (err) {
          showError("Error connecting to server.");
      }
    }
  </script>
</body>
</html>\;

fs.writeFileSync('frontend/mentorship.html', content, 'utf8');
