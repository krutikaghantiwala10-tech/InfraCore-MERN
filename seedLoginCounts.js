require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Contractor = require("./models/Contractor");
const Feedbacks = require("./models/Feedbacks");

mongoose.connect("mongodb://localhost:27017/testdb")
  .then(async () => {
    console.log("Connected ✅");

    // Give all existing users a random loginCount between 1–15
    const users = await User.find({});
    for (const u of users) {
      if (!u.loginCount || u.loginCount === 0) {
        const count = Math.floor(Math.random() * 15) + 1;
        await User.findByIdAndUpdate(u._id, { loginCount: count, lastLogin: new Date() });
        console.log(`User ${u.name}: loginCount = ${count}`);
      }
    }

    // Give all existing contractors a random loginCount between 1–10
    const contractors = await Contractor.find({});
    for (const c of contractors) {
      if (!c.loginCount || c.loginCount === 0) {
        const count = Math.floor(Math.random() * 10) + 1;
        await Contractor.findByIdAndUpdate(c._id, { loginCount: count, lastLogin: new Date() });
        console.log(`Contractor ${c.name}: loginCount = ${count}`);
      }
    }

    // Give all existing feedbacks a rating if missing
    const feedbacks = await Feedbacks.find({});
    const ratings = [3, 4, 5, 4, 5, 3, 4, 5, 2, 4];
    for (let i = 0; i < feedbacks.length; i++) {
      if (!feedbacks[i].rating) {
        const r = ratings[i % ratings.length];
        await Feedbacks.findByIdAndUpdate(feedbacks[i]._id, { rating: r });
        console.log(`Feedback ${feedbacks[i].name}: rating = ${r}`);
      }
    }

    console.log("\nDone seeding login counts and ratings ✅");
    mongoose.disconnect();
  })
  .catch(err => { console.error(err); mongoose.disconnect(); });
