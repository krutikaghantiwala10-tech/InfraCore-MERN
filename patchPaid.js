require("dotenv").config();
const mongoose = require("mongoose");
const HireRequest = require("./models/HireRequest");

mongoose.connect("mongodb://localhost:27017/testdb").then(async () => {
  const accepted = await HireRequest.find({ status: "accepted" });
  for (const r of accepted) {
    if (!r.proposedCost) continue;
    const adminRevenue = parseFloat((r.proposedCost * 0.03).toFixed(2));
    await HireRequest.findByIdAndUpdate(r._id, {
      status: "paid",
      adminRevenue,
      paymentId: "manual_patch_" + r._id
    });
    console.log(`Patched: "${r.projectTitle}" | cost: ₹${r.proposedCost} | admin revenue: ₹${adminRevenue}`);
  }
  console.log("Done ✅");
  mongoose.disconnect();
});
