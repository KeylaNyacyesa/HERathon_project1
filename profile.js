const fs = require('fs');

const content = \<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profile — HERathon</title>
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="toast.css">
</head>
<body>

  <script src="shared-nav.js"></script>

  <div class="page-wrapper" style="max-width:800px;">

    <div class="page-header">
      <div>
        <h2 class="page-title">👤 Your Profile</h2>
        <p>Manage your HERathon adventure and account details.</p>
      </div>
    </div>

    <div class="card">
      <div class="card-title">🪪 Account Overview</div>

      <div id="userInfo" style="margin-bottom:2rem; padding:1.5rem; background:var(--bg-dark); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
        <p style="color:var(--text-faint);">Loading profile...</p>
      </div>

      <div style="display:flex; gap:1rem; flex-wrap:wrap;">
        <button onclick="toggleEditMode()" class="btn-secondary" style="width:auto;">✏️ Edit Profile</button>
        <button id="manageCoursesBtn" onclick="window.location.href='select-courses.html'" class="btn-primary" style="width:auto; display:none;">📚 Manage Courses</button>
        <button onclick="logout()" class="btn-danger" style="width:auto;">🚪 Sign Out</button>
      </div>
    </div>

    <!-- Edit Profile Section (Hidden by default) -->
    <div id="editProfileSection" class="card" style="display:none; margin-top: 2rem;">
       <div class="card-title">✏️ Edit Profile Details</div>
       <div style="display:flex; flex-direction:column; gap:1rem;">
          <div>
            <label style="color:var(--text-muted); font-size:0.9rem; margin-bottom:0.25rem; display:block;">Full Name</label>
            <input type="text" id="editName" class="form-input" style="width:100%;" />
          </div>
          <div>
            <button onclick="saveProfile()" class="btn-primary" style="width:auto;">Save Changes</button>
            <button onclick="toggleEditMode()" class="btn-secondary" style="width:auto; margin-left: 0.5rem;">Cancel</button>
          </div>
       </div>
    </div>

  </div>

  <script src="toast.js"></script>
  <script>
    function loadProfile() {
      const userStr = localStorage.getItem("user");
      if (!userStr) return window.location.href = "index.html";
      const user = JSON.parse(userStr);

      if (user.role === 'student') {
         document.getElementById('manageCoursesBtn').style.display = 'inline-block';
      }

      document.getElementById("userInfo").innerHTML = \\\
        <div style="display:grid; grid-template-columns: 80px 1fr; gap: 1.5rem; align-items:center; margin-bottom:1.5rem;">
          <div class="avatar-circle" style="width:72px; height:72px; font-size:2rem; background:linear-gradient(135deg,#6366f1,#ec4899); margin:0;">
            \\\
          </div>
          <div>
            <h3 style="font-size:1.4rem; color:var(--text-main); margin-bottom:0.25rem;">\\\</h3>
            <p style="margin:0; color:var(--text-muted); font-size:0.95rem;">\\\</p>
            <span class="badge badge-primary" style="margin-top:0.5rem; display:inline-flex;">\\\</span>
          </div>
        </div>
        <hr style="border:none; border-top:1px dashed var(--border-subtle); margin:0 0 1.25rem;">
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem;">
          <div class="gamification-stat">
            <span class="label">🏅 Badges</span>
            <span class="value" style="font-size:1rem; color:var(--text-muted);">\\\</span>
          </div>
        </div>
      \\\;
    }

    function toggleEditMode() {
       const section = document.getElementById("editProfileSection");
       if (section.style.display === "none") {
          section.style.display = "block";
          const userStr = localStorage.getItem("user");
          if (userStr) {
             const user = JSON.parse(userStr);
             document.getElementById("editName").value = user.name || "";
          }
       } else {
          section.style.display = "none";
       }
    }

    function saveProfile() {
       const newName = document.getElementById("editName").value;
       if (!newName.trim()) return showError("Name cannot be empty");
       
       const userStr = localStorage.getItem("user");
       if (userStr) {
          const user = JSON.parse(userStr);
          user.name = newName;
          // Note: In a real app we'd call the backend to update here
          // Mock backend update:
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("name", newName);
          showSuccess("Profile updated successfully! (Mock)");
          toggleEditMode();
          loadProfile();
          // Update nav if it exists
          setTimeout(() => location.reload(), 1000); 
       }
    }

    function logout() {
      localStorage.clear();
      showSuccess("Signing you out securely...");
      setTimeout(() => { window.location.href = "index.html"; }, 1500);
    }

    window.onload = loadProfile;
  </script>
</body>
</html>\;

fs.writeFileSync('frontend/profile.html', content, 'utf8');
