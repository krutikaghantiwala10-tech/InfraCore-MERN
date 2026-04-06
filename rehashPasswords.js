require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Contractor = require("./models/Contractor");
const User = require("./models/User");

mongoose.connect("mongodb://localhost:27017/testdb").then(async () => {
  console.log("Connected ✅");

  // Rehash contractors
  const contractors = await Contractor.find();
  for (const c of contractors) {
    if (!c.password.startsWith("$2")) { // not already hashed
      c.password = await bcrypt.hash(c.password, 10);
      await c.save();
      console.log(`Rehashed contractor: ${c.name}`);
    }
  }

  // Rehash users
  const users = await User.find();
  for (const u of users) {
    if (u.password && !u.password.startsWith("$2")) {
      u.password = await bcrypt.hash(u.password, 10);
      await u.save();
      console.log(`Rehashed user: ${u.name}`);
    }
  }

  console.log("Done ✅");
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
