const fs = require('fs'); 
let c = fs.readFileSync('frontend/dashboard.js', 'utf8'); 
const newInner = 
    <div class="mentor-panel">
      <h2>????? Mentor Dashboard</h2>
      <div class="mentor-quick-links">
        <a href="submissions-review.html" class="btn-link">?? Review Student Submissions</a>
      </div>

      <div class="mentor-stats" style="margin-top:2rem;">
        <h3>?? Pending Mentorship Requests</h3>
        <div id="mentorRequests" class="cards" style="margin-top:1rem;"><p>Loading requests...</p></div>
      </div>

      <div class="mentor-stats" style="margin-top:2rem;">
        <h3>????? My Active Students</h3>
        <button class="btn-primary" style="margin-bottom:1rem;" onclick="loadMyStudents()">Load Students</button>
        <ul id="studentList"></ul>
      </div>
    </div>
  ; 
c = c.replace(/dashboard\.innerHTML = \[\s\S]*?<ul id="studentList"><\/ul>\n      <\/div>\n    <\/div>\n  \;/, 'dashboard.innerHTML = '+newInner+';\n\n  await loadMentorRequests();'); 
fs.writeFileSync('frontend/dashboard.js', c);
