require("dotenv").config({ override: true });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const challengeRoutes = require("./routes/challenges");
const teamRoutes = require("./routes/teams");
const submissionRoutes = require("./routes/submissions");
const scholarshipRoutes = require("./routes/scholarships");
const mentorRoutes = require("./routes/mentors");
const adminRoutes = require("./routes/admin");
const notificationRoutes = require("./routes/notifications");

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
console.log("Mongo URI:", mongoUri);
mongoose.connect(mongoUri)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log("MongoDB Error:", err));

app.use("/auth", authRoutes);
app.use("/challenges", challengeRoutes);
app.use("/teams", teamRoutes);
app.use("/submissions", submissionRoutes);
app.use("/scholarships", scholarshipRoutes);
app.use("/mentors", mentorRoutes);
app.use("/admin", adminRoutes);
app.use("/notifications", notificationRoutes);

app.get("/", (req,res)=>{
    res.send("HERathon API running");
});

app.get("/foo", (req, res) => {
  res.send("Foo works");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});