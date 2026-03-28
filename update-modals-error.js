const fs = require('fs');

const files = ['frontend/challenges.html', 'frontend/fixed/challenges.html'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Replace submitChallenge
    const submitRegex = /async function submitChallenge\(challengeId[\s\S]*?showError\("Submission failed — please try again"\);\n      \}\n    \}/;

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

      try {
        const res = await fetch(\`\${API_URL}/submissions\`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: \`Bearer \${token}\` },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
          if (data.autoGraded) {
            showSuccess("Challenge auto-graded! You earned points 🌟");
          } else {
            showSuccess("Submission sent! Awaiting mentor review ✨");
          }
          document.querySelector(".challenge-modal").remove();
          loadChallenges();
          loadPageGamification();
        } else {
          showError(data.message || "Submission failed — please try again");
        }
      } catch (err) {
        showError("An error occurred. Please try again.");
      }
    }`;

    if(submitRegex.test(content)){
        content = content.replace(submitRegex, newSubmit);
        fs.writeFileSync(file, content);
        console.log('Updated', file);
    } else {
        console.log('Could not find submit regex in', file);
    }
  }
});