const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Challenge = require("./backend/models/Challenge");

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/herathon").then(async () => {
  console.log("Connected to MongoDB for Seeding!");

  // Clear old test challenges
  await Challenge.deleteMany({});
  
  const sampleChallenges = [
    // Mathematics
    { title: "Algebra Basics", description: "Solve a basic linear equation.", course: "Mathematics", topic: "Algebra", level: 1, points: 50 },
    { title: "Quadratic Equations", description: "Find the roots of a quadratic function.", course: "Mathematics", topic: "Algebra", level: 2, points: 100 },
    { title: "Derivatives 101", description: "Introduction to limits and derivatives.", course: "Mathematics", topic: "Calculus", level: 1, points: 50 },
    
    // Computer Science
    { title: "Hello World", description: "Write a program that prints Hello World.", course: "Computer Science", topic: "Programming Languages", level: 1, points: 50 },
    { title: "Array Sorting", description: "Implement Bubble Sort in your favorite language.", course: "Computer Science", topic: "Algorithms and Data Structures", level: 2, points: 100 },
    { title: "Network Topologies", description: "Design a basic LAN topology map.", course: "Computer Science", topic: "Computer Networks", level: 1, points: 50 },

    // Biology
    { title: "Cell Structure", description: "Identify parts of an animal cell.", course: "Biology", topic: "Cell Biology & Molecular Biology", level: 1, points: 50 },
    { title: "Mendelian Genetics", description: "Calculate probabilities using a Punnett square.", course: "Biology", topic: "Genetics & Heredity", level: 2, points: 100 }
  ];

  await Challenge.insertMany(sampleChallenges);
  console.log("✅ Seeded Sample Challenges Successfully!");
  
  process.exit();
}).catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});