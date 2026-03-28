// shared-nav.js
(function () {
  let currentPage = window.location.pathname.split("/").pop() || "index.html";
  if (currentPage === "") currentPage = "index.html";

  // Quick check to see if we are running in an environment that requires .html
  const isLocalHtml = window.location.pathname.endsWith(".html") || window.location.protocol === "file:" || window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost" || window.location.port !== "";
  
  function getLink(page) {
    if (page === "index" || page === "index.html") return isLocalHtml ? "index.html" : "/";
    return isLocalHtml ? page + ".html" : "/" + page;
  }

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userRole = user ? (user.role || "student") : "student";

  let navLinks = [];

  if (userRole === "mentor") {
    navLinks = [
      { page: "dashboard", label: "🗺️ Hub" },
      { page: "submissions-review", label: "📋 Review Submissions" },
      { page: "teams", label: "👥 Teams" },
      { page: "scholarships", label: "🎓 Scholarships" }
    ];
  } else if (userRole === "admin") {
    navLinks = [
      { page: "dashboard", label: "🗺️ Hub" },
      { page: "teams", label: "👥 Teams" },
      { page: "scholarships", label: "🎓 Scholarships" }
    ];
  } else {
    // Student
    navLinks = [
      { page: "dashboard", label: "🗺️ Hub" },
      { page: "challenges", label: "⚔️ Challenges" },
      { page: "teams", label: "👥 Teams" },
      { page: "mentorship", label: "🧠 Mentorship" },
      { page: "scholarships", label: "🎓 Scholarships" }
    ];
  }

  if (currentPage === "index.html" || currentPage === "index") return;

  const navLinksHtml = navLinks.map(l => {
    // Treat active class logic inclusively
    const isActive = currentPage === l.page || currentPage === l.page + ".html" || currentPage === l.page + "/";
    return `<a href="${getLink(l.page)}" class="${isActive ? "active" : ""}">${l.label}</a>`;
  }).join("");

  const mobileLinksHtml = navLinks.map(l =>
    `<a href="${getLink(l.page)}">${l.label}</a>`
  ).join("");

  const avatarLetter = user && user.name ? user.name.charAt(0).toUpperCase() : "?";
  const userName = user && user.name ? user.name : "Profile";

  const headerHtml = `
    <header class="top-header" id="globalHeader">
      <a href="${getLink("dashboard")}" class="header-brand">
        🎮 <span>HERathon</span>
      </a>
      <nav class="header-nav" aria-label="Main navigation" style="display:flex; align-items:center; gap:0.5rem; justify-content: flex-start; flex:1; margin-left: 2rem;">
        ${navLinksHtml}
      </nav>
      <div class="header-actions">
        <a href="${getLink("profile")}" class="profile-pill" style="text-decoration:none;">
          <span class="avatar-circle">${avatarLetter}</span>
          ${userName}
        </a>
        <button class="btn-logout" onclick="sharedLogout()" style="padding: 0.45rem 1rem;">Sign out</button>
        <button class="nav-toggle" aria-label="Toggle menu" onclick="toggleMobileNav()">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
    <nav class="mobile-nav" id="mobileNav" aria-label="Mobile navigation">
      ${mobileLinksHtml}
      <a href="${getLink("profile")}">👤 Profile</a>
      <button onclick="sharedLogout()" style="color:#fca5a5; background:none; border:none; text-align:left; cursor:pointer;">🚪 Sign out</button>
    </nav>
  `;

  try {
    // Use requestAnimationFrame or setTimeout to ensure document body is ready.
    if(document.body) {
        document.body.insertAdjacentHTML("afterbegin", headerHtml);
    } else {
        window.addEventListener("DOMContentLoaded", () => {
            document.body.insertAdjacentHTML("afterbegin", headerHtml);
        });
    }
  } catch(e) {
      console.error("Header insertion failed", e);
  }

  window.toggleMobileNav = function () {
    document.getElementById("mobileNav").classList.toggle("open");
  };

  window.sharedLogout = function () {
    localStorage.clear();
    window.location.href = getLink("index");
  };

  })();
