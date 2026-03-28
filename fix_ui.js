const fs = require('fs');
const path = 'frontend/dashboard.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Hide the page-header for mentors
content = content.replace(
  'const gamificationPanel = document.querySelector(".gamification-panel");',
  'const pageHeader = document.querySelector(".page-header");\n  const gamificationPanel = document.querySelector(".gamification-panel");'
);

content = content.replace(
  'if (gamificationPanel) gamificationPanel.style.display = "none";',
  'if (pageHeader) pageHeader.style.display = "none";\n    if (gamificationPanel) gamificationPanel.style.display = "none";'
);

// 2. Change the mount point for mentor stats
content = content.replace(
  'const dashboardContainer = document.querySelector("main") || document.body;',
  'const dashboardContainer = document.getElementById("dashboardContent") || document.querySelector(".dashboard-container") || document.body;'
);

// 3. Make sure the admin dashboard mounts properly as well
// There is a second occurrence of document.querySelector("main") || document.body;
content = content.replace(
  'const dashboardContainer = document.querySelector("main") || document.body;',
  'const dashboardContainer = document.getElementById("dashboardContent") || document.querySelector(".dashboard-container") || document.body;'
);

fs.writeFileSync(path, content);
console.log("Fixed dashboard.js logic");