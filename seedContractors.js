require("dotenv").config();
const mongoose = require("mongoose");
const Contractor = require("./models/Contractor");

const contractors = [
  { name: "Om Patel",        email: "om@gmail.com",        phone: "9876543210", specialization: "Structural Engineer",          experience: 8,  status: "active", password: "Om@1234" },
  { name: "Pankaj Mishra",   email: "pankajsir@gmail.com", phone: "9876543211", specialization: "Civil Engineer",               experience: 10, status: "active", password: "Pankaj@1234" },
  { name: "Kartik Thakkar",  email: "kartik@example.com",  phone: "9876543212", specialization: "Architecture & Design",        experience: 6,  status: "active", password: "Kartik@1234" },
  { name: "Rohit Varma",     email: "rohit@gmail.com",     phone: "9087676650", specialization: "Building Information Modeling",experience: 5,  status: "active", password: "Rohit@1234" },
  { name: "Dhirendra Tandel",email: "dhirendra@gmail.com", phone: "9876543213", specialization: "Electrical & Plumbing Works",  experience: 7,  status: "active", password: "Dhirendra@1234" },
  { name: "Raj Jariwala",    email: "raj23@gmail.com",     phone: "7890876540", specialization: "Interior & Finishing Works",   experience: 9,  status: "active", password: "Raj@1234" },
];

mongoose.connect("mongodb://localhost:27017/testdb")
  .then(async () => {
    console.log("MongoDB Connected ✅");
    for (const c of contractors) {
      const exists = await Contractor.findOne({ email: c.email });
      if (!exists) {
        await Contractor.create(c);
        console.log(`Added: ${c.name}`);
      } else {
        console.log(`Already exists: ${c.name}`);
      }
    }
    console.log("Done ✅");
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });
