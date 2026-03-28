const fs = require('fs');

const code = \
async function loadMentorRequests() {
  const token = localStorage.getItem('token');
  const reqContainer = document.getElementById('mentorRequests');
  if (!reqContainer) return;

  try {
    const res = await fetch(\\\\/mentors/my-mentorships\\\, {
      headers: { Authorization: \\\Bearer \\\\ }
    });
    const mentorships = await res.json();
    
    let myId = null;
    try {
      const authRes = await fetch(\\\\/auth/me\\\, { headers: { Authorization: \\\Bearer \\\\ } });
      const profile = await authRes.json();
      myId = profile.user._id;
    } catch(err) { console.error(err); }

    const pendingReqs = mentorships.filter(m => m.status === 'pending' && m.mentorId && String(m.mentorId._id || m.mentorId) === String(myId));

    if (pendingReqs.length === 0) {
      reqContainer.innerHTML = '<p style="color:var(--text-faint);">No pending requests.</p>';
      return;
    }

    let html = '';
    for(const req of pendingReqs) {
       html += '<div class="card" style="padding:1.5rem; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center;"><div><h4 style="margin:0 0 0.25rem 0; font-size:1.1rem; color:var(--text-main);">' + (req.menteeId ? req.menteeId.name : 'Unknown Student') + '</h4><p style="font-size:0.9rem; margin:0; color:var(--text-muted);">Requested mentorship</p></div><div style="display:flex; gap:0.5rem;"><button class="btn-success" onclick="updateMentorshipStatus(\\'' + req._id + '\\', \\'active\\')">Accept</button><button class="btn-danger" style="background:transparent; border:1px solid #ef4444; color:#ef4444; padding:0.4rem 1rem; border-radius:var(--radius-sm); cursor:pointer;" onclick="updateMentorshipStatus(\\'' + req._id + '\\', \\'declined\\')">Decline</button></div></div>';
    }
    reqContainer.innerHTML = html;
  } catch(e) {
    reqContainer.innerHTML = '<p style="color:var(--danger);">Error loading requests.</p>';
  }
}

window.updateMentorshipStatus = async function(reqId, status) {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(\\\\/mentors/request/\/status\\\, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: \\\Bearer \\\\
      },
      body: JSON.stringify({ status: status })
    });
    
    if (res.ok) {
      if(typeof showSuccess !== 'undefined') showSuccess('Request ' + status + '!');
      loadMentorRequests();
      loadMyStudents();
    } else {
      const data = await res.json();
      if(typeof showError !== 'undefined') showError(data.message || 'Error updating status');
    }
  } catch(e) {
    if(typeof showError !== 'undefined') showError('Network error');
  }
};
\;

let content = fs.readFileSync('frontend/dashboard.js', 'utf8');
content = content.replace(/async function loadMentorRequests[\\s\\S]*/, '');
fs.writeFileSync('frontend/dashboard.js', content + '\\n' + code);
