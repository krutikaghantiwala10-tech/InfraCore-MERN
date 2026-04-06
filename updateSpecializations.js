require("dotenv").config();
const mongoose = require("mongoose");
const Contractor = require("./models/Contractor");

const updates = [
  { email: "om@gmail.com",         specialization: "Structural Engineer",         experience: 8 },
  { email: "pankajsir@gmail.com",  specialization: "Civil Engineer",               experience: 10 },
  { email: "kartik@example.com",   specialization: "Architecture & Design",        experience: 6 },
  { email: "rohit@gmail.com",      specialization: "Building Information Modeling",experience: 5 },
  { email: "dhirendra@gmail.com",  specialization: "Electrical & Plumbing Works",  experience: 7 },
  { email: "raj23@gmail.com",      specialization: "Interior & Finishing Works",   experience: 9 },
];

mongoose.connect("mongodb://localhost:27017/testdb").then(async () => {
  for (const u of updates) {
    await Contractor.findOneAndUpdate({ email: u.email }, { specialization: u.specialization, experience: u.experience });
    console.log(`Updated: ${u.email} → ${u.specialization}`);
  }
  console.log("Done ✅");
  mongoose.disconnect();
}).catch(err => { console.error(err); mongoose.disconnect(); });
