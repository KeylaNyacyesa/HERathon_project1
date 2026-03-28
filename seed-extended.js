const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Challenge = require("./backend/models/Challenge");

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/herathon").then(async () => {
  console.log("Connected to MongoDB for Seeding!");

  // Clear old test challenges
  await Challenge.deleteMany({});

  const sampleChallenges = [
    // Mathematics -> Algebra
    { title: "Algebra Basics 1", description: "What is the value of x if 2x = 10?", course: "Mathematics", topic: "Algebra", level: 1, points: 50 },
    { title: "Algebra Basics 2", description: "Simplify the expression: 3(x + 4) - 2x.", course: "Mathematics", topic: "Algebra", level: 2, points: 100 },
    { title: "Quadratic Concepts", description: "What is the formula for the discriminant of a quadratic equation?", course: "Mathematics", topic: "Algebra", level: 3, points: 150 },
    { title: "Quadratic Solver (Upload Code)", description: "Write a program or script that takes a, b, and c and prints the roots. Upload your code file link.", course: "Mathematics", topic: "Algebra", level: 4, points: 200 },
    { title: "Advanced Polynomials App", description: "Build a web app that graphs polynomials of any degree. Upload the live project link.", course: "Mathematics", topic: "Algebra", level: 5, points: 300 },

    // Mathematics -> Calculus
    { title: "Limits Intro", description: "What is the limit of (1/x) as x approaches infinity?", course: "Mathematics", topic: "Calculus", level: 1, points: 50 },
    { title: "Power Rule", description: "What is the derivative of x^3?", course: "Mathematics", topic: "Calculus", level: 2, points: 100 },
    { title: "Integration Basics", description: "What is the integral of 2x dx?", course: "Mathematics", topic: "Calculus", level: 3, points: 150 },
    { title: "Integral Calculator Project", description: "Build a tool that computes definite integrals using Simpson's Rule. Submit your GitHub link.", course: "Mathematics", topic: "Calculus", level: 4, points: 200 },

    // Computer Science -> Programming Languages
    { title: "First Step", description: "What is the command to print text in python?", course: "Computer Science", topic: "Programming Languages", level: 1, points: 50 },
    { title: "Data Types", description: "Name the data type used for storing True or False.", course: "Computer Science", topic: "Programming Languages", level: 2, points: 100 },
    { title: "Loops", description: "What loop will you use if you know exactly how many times to iterate? (e.g. For, While, Do-While)", course: "Computer Science", topic: "Programming Languages", level: 3, points: 150 },
    { title: "Build a CLI App", description: "Create a CLI application in Python or Node.js that scrapes weather data. Upload your repo link.", course: "Computer Science", topic: "Programming Languages", level: 4, points: 200 },
    { title: "Full-Stack Web App", description: "Build a full-stack to-do list with a database. Submit your deployed URL.", course: "Computer Science", topic: "Programming Languages", level: 5, points: 300 },

    // Computer Science -> Algorithms and Data Structures
    { title: "Big O Notation", description: "What is the time complexity of accessing an array element by index?", course: "Computer Science", topic: "Algorithms and Data Structures", level: 1, points: 50 },
    { title: "Sorting Methods", description: "Which sorting algorithm is generally faster for large datasets: Bubble Sort or Merge Sort?", course: "Computer Science", topic: "Algorithms and Data Structures", level: 2, points: 100 },
    { title: "Stacks & Queues", description: "Which data structure follows LIFO (Last In First Out)?", course: "Computer Science", topic: "Algorithms and Data Structures", level: 3, points: 150 },
    { title: "Pathfinding Visualizer", description: "Implement a visualizer for Dijkstra's or A* algorithm in the browser. Submit your live link and repo.", course: "Computer Science", topic: "Algorithms and Data Structures", level: 4, points: 200 },

    // Biology -> Cell Biology
    { title: "Cell Powerhouse", description: "What is considered the powerhouse of the cell?", course: "Biology", topic: "Cell Biology", level: 1, points: 50 },
    { title: "Plant vs Animal", description: "Name the organelle that plant cells have but animal cells do not. (Hint: Used for photosynthesis)", course: "Biology", topic: "Cell Biology", level: 2, points: 100 },
    { title: "Protein Factories", description: "Which organelles are responsible for protein synthesis?", course: "Biology", topic: "Cell Biology", level: 3, points: 150 },
    { title: "Cell Model Simulation", description: "Create a 3D or interactive digital model of a eukaryotic cell. Upload your project link.", course: "Biology", topic: "Cell Biology", level: 4, points: 200 },
    
    // Biology -> Genetics
    { title: "DNA Base Pairs", description: "Which base always pairs with Adenine in DNA?", course: "Biology", topic: "Genetics", level: 1, points: 50 },
    { title: "Mendelian Traits", description: "If a trait skips a generation, is it likely dominant or recessive?", course: "Biology", topic: "Genetics", level: 2, points: 100 },
    { title: "Punnett Square", description: "What ratio of offspring are expected to show the recessive trait when two heterozygotes are crossed?", course: "Biology", topic: "Genetics", level: 3, points: 150 },
    { title: "Genetics Algorithm", description: "Write a genetic algorithm in code that mimics natural selection to optimize a string. Provide the repo link.", course: "Biology", topic: "Genetics", level: 4, points: 200 }
  ];

  await Challenge.insertMany(sampleChallenges);
  console.log("✅ Seeded Extended Sample Challenges Successfully!");

  process.exit();
}).catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});