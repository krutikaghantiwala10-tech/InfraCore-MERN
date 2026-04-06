require("dotenv").config();
const mongoose = require("mongoose");
const Contractor = require("./models/Contractor");

const dojMap = [
  { name: "Om Patel",        DOJ: new Date("2021-03-15") },
  { name: "Pankaj Mishra",   DOJ: new Date("2020-07-22") },
  { name: "Kartik Thakkar",  DOJ: new Date("2019-11-05") },
  { name: "Rohit Varma",     DOJ: new Date("2022-01-10") },
  { name: "Dhirendra Tandel",DOJ: new Date("2018-06-30") },
  { name: "Raj Jariwala",    DOJ: new Date("2023-04-18") },
];

mongoose.connect("mongodb://localhost:27017/testdb")
  .then(async () => {
    console.log("MongoDB Connected ✅");
    for (const entry of dojMap) {
      const result = await Contractor.findOneAndUpdate(
        { name: entry.name },
        { DOJ: entry.DOJ },
        { new: true }
      );
      if (result) console.log(`✅ Updated DOJ for ${entry.name}: ${entry.DOJ.toDateString()}`);
      else console.log(`⚠️  Contractor not found: ${entry.name}`);
    }
    mongoose.disconnect();
    console.log("Done.");
  })
  .catch(err => console.error(err));
