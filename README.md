# HERathon - Empowering Women in STEM

HERathon is a dedicated hackathon platform designed to empower African women in STEM. It seamlessly connects students (mentees) with experienced mentors, gamifies learning through challenges and XP, facilitates team collaboration, and provides access to scholarship opportunities.

## Live Demo
- **Frontend URL:** https://herathon.vercel.app/
- **Backend URL:** https://herathonbackend.onrender.com

---

## Setup & Installation Instructions
Follow these step-by-step instructions to get the project running locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v14 or higher)
- [Git](https://git-scm.com/) installed
- A [MongoDB](https://www.mongodb.com/) cluster URI

### Step 1: Clone the Repository
``bash
git clone https://github.com/KeylaNyacyesa/HERathon_project1.git
cd HERathon_project1
``

### Step 2: Set up the Backend
1. Open a terminal and navigate to the backend folder:
   ``bash
   cd backend
   ``
2. Install the required dependencies:
   ``bash
   npm install
   ``
3. Create a .env file in the root of the ackend folder and add your environment variables:
   ``env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_jwt_secret_key_here
   ``
4. Start the backend server:
   ``bash
   npm start
   ``
   *The server should now be running on http://localhost:5000*

### Step 3: Set up the Frontend
The frontend is built using Vanilla HTML, CSS, and JavaScript, meaning no complex build tools or bundlers (like React/npm) are required.

1. Open a new terminal and navigate to the frontend folder:
   ``bash
   cd frontend
   ``
2. Open script.js or shared-nav.js (or any API calling file) and ensure the API_URL variable is pointed to http://localhost:5000 for local testing (instead of the live Render URL).
3. To view the app, it is highly recommended to use a local development server (to prevent CORS/file-protocol issues). You can use:
   - **VS Code:** Install the "Live Server" extension, right-click index.html and select "Open with Live Server".
   - **Or use Node's serve package:**
     ``bash
     npx serve
     ``
4. The prototype will open in your browser (usually at http://localhost:3000 or http://127.0.0.1:5500).

---

## Core Features Built
- **Role-Based Access Control:** Secure Login/Signup for student, mentor, and dmin roles.
- **Mentorship System:** Mentors can accept/reject students. Accepted students submit projects directly for mentor review.
- **Challenges & Gamification:** Users complete challenges to earn XP points and level up.
- **Submissions Hub:** Submit GitHub repo links. Status tracks dynamically (pending, pproved, ejected).
- **Team Collaboration:** Browse, create, and join teams based on skill needs.
- **Scholarships:** Conditional gating (e.g., users must reach Level 3 to unlock scholarship applications).
- **Admin Panel:** Centralized dashboard for user and challenge management.
- **Interactive Support:** Working Web3Forms integration for direct email support & live chat UI widget.
