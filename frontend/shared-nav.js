(function () {
  let currentPage = window.location.pathname.split("/").pop() || "index.html";  
  if (currentPage === "") currentPage = "index.html";

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
      { page: "dashboard", label: "Dashboard" },
      { page: "submissions-review", label: "Review Submissions" },
      { page: "mentorship", label: "Mentorship" }
    ];
  } else if (userRole === "admin") {
    navLinks = [
      { page: "dashboard", label: "Dashboard" },
      { page: "admin", label: "Admin Panel" },
      { page: "submissions-review", label: "Review Submissions" }
    ];
  } else {
    // Student
    navLinks = [
      { page: "dashboard", label: "Hub" },
      { page: "challenges", label: "Challenges" },
      { page: "teams", label: "Teams" },
      { page: "mentorship", label: "Mentorship" },
      { page: "scholarships", label: "Scholarships" }
    ];
  }

  if (currentPage === "index.html" || currentPage === "index") return;

  const navLinksHtml = navLinks.map(l => {
    const isActive = currentPage === l.page || currentPage === l.page + ".html";
    return `<a href="${getLink(l.page)}" class="${isActive ? "active" : ""}">${l.label}</a>`;
  }).join("");

  const avatarLetter = user && user.name ? user.name.charAt(0).toUpperCase() : "?";
  
  // Format the visual pill label: "Keyla · Mentor"
  const firstName = user && user.name ? user.name.split(" ")[0] : "Profile";
  const displayRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);
  const pillLabel = `${firstName} &middot; <small style="opacity:0.8">${displayRole}</small>`;

  const headerHtml = `
    <header class="top-header" id="globalHeader">
      <a href="${getLink("dashboard")}" class="header-brand">
        <span>HERathon</span>
      </a>
      <nav class="header-nav" aria-label="Main navigation">
        ${navLinksHtml}
      </nav>
      <div class="header-actions">
        <a href="${getLink("profile")}" class="profile-pill" style="text-decoration:none;">
          <span class="avatar-circle">${avatarLetter}</span>
          <span>${pillLabel}</span>
        </a>
        <button class="btn-logout" onclick="sharedLogout()" style="padding: 0.45rem 1rem;">Sign out</button>
      </div>
    </header>
  `;

  document.addEventListener("DOMContentLoaded", () => {
    document.body.insertAdjacentHTML("afterbegin", headerHtml);
  });

  window.sharedLogout = function () {
    localStorage.clear();
    window.location.href = getLink("index");
  };
})();
