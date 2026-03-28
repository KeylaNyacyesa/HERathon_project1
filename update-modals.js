const fs = require('fs');

const files = ['frontend/challenges.html', 'frontend/fixed/challenges.html'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Replace openChallengeModal
    const openModalRegex = /function openChallengeModal\(challenge\) \{[\s\S]*?document\.body\.appendChild\(modal\);\n    \}/;
    
    const newOpenModal = `function openChallengeModal(challenge) {
      const existing = document.querySelector(".challenge-modal");
      if (existing) existing.remove();

      const isSimple = challenge.level <= 3;

      const modal = document.createElement("div");
      modal.className = "challenge-modal";
      modal.innerHTML = \`
        <div class="modal-content">
          <h3>\${challenge.title}</h3>
          <span class="badge badge-primary">Level \${challenge.level}</span>
          <p style="color:var(--text-muted); margin-top:0.5rem;">\${challenge.description || 'Complete this challenge to earn 50 XP!'}</p>
          \${challenge.deadline ? \`<p style="font-size:0.85rem; color:var(--text-faint);">⏰ Deadline: \${new Date(challenge.deadline).toLocaleDateString()}</p>\` : ''}
          
          \${isSimple ? \`
            <label>Your Answer<input id="modalSimpleAnswer" placeholder="Type your answer here..."></label>
          \` : \`
            <label>GitHub / Project URL<input id="modalProjectLink" placeholder="https://github.com/…"></label>
            <label>Describe your solution<textarea id="modalDescription" placeholder="What did you build and what did you learn?"></textarea></label>
          \`}

          <div class="modal-buttons">
            <button onclick="submitChallenge('\${challenge._id}', \${isSimple})" class="btn-success">🚀 Submit</button>
            <button onclick="document.querySelector('.challenge-modal').remove()" class="btn-ghost">Cancel</button>
          </div>
        </div>
      \`;
      document.body.appendChild(modal);
    }`;

    content = content.replace(openModalRegex, newOpenModal);

    // Replace submitChallenge
    const submitRegex = /async function submitChallenge\(challengeId\) \{[\s\S]*?showError\("Submission failed — please try again"\);\n      \}\n    \}/;

    const newSubmit = `async function submitChallenge(challengeId, isSimple = false) {
      const token = localStorage.getItem("token");
      
      let payload = { challengeId, isSimple };

      if (isSimple) {
        const answer = document.getElementById("modalSimpleAnswer").value;
        if (!answer) {
          showError("Please enter an answer to submit.");
          return;
        }
        payload.answer = answer;
      } else {
        const projectLink = document.getElementById("modalProjectLink").value;
        const description = document.getElementById("modalDescription").value;

        if (!projectLink || !description) {
          showError("Please fill in both the project link and description");
          return;
        }
        payload.projectLink = projectLink;
        payload.description = description;
      }

      const res = await fetch(\`\${API_URL}/submissions\`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: \`Bearer \${token}\` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.autoGraded) {
          showSuccess("Challenge auto-graded! You earned points 🌟");
        } else {
          showSuccess("Submission sent! Awaiting mentor review ✨");
        }
        document.querySelector(".challenge-modal").remove();
        loadChallenges();
        loadPageGamification();
      } else {
        showError("Submission failed — please try again");
      }
    }`;

    content = content.replace(submitRegex, newSubmit);

    // Ensure we also grab slice(0, 15) instead of 8 to show more challenges
    content = content.replace(/challengesData\.slice\(0, 8\)/g, "challengesData.slice(0, 20)");

    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
});