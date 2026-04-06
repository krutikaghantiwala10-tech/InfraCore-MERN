require("dotenv").config();
const mongoose = require("mongoose");
const HireRequest = require("./models/HireRequest");
const Receipt = require("./models/Receipt");
const User = require("./models/User");

mongoose.connect("mongodb://localhost:27017/testdb")
  .then(async () => {
    console.log("MongoDB Connected ✅");

    const paidRequests = await HireRequest.find({ status: "paid" });
    console.log(`Found ${paidRequests.length} paid hire request(s).`);

    let added = 0, skipped = 0;

    for (const req of paidRequests) {
      // Skip if receipt already exists for this hire request
      const existing = await Receipt.findOne({ hireRequestId: req._id });
      if (existing) {
        console.log(`⏭  Skipping (already exists): ${req.projectTitle}`);
        skipped++;
        continue;
      }

      // Try to get user details
      let user = null;
      try { user = await User.findById(req.userId); } catch {}

      const adminRevenue = req.adminRevenue ?? Math.round((req.proposedCost || 0) * 0.03);
      const contractorAmount = (req.proposedCost || 0) - adminRevenue;

      const receipt = new Receipt({
        hireRequestId:    req._id,
        userId:           req.userId,
        contractorId:     req.contractorId,
        userName:         req.userName || user?.name || "N/A",
        userEmail:        req.userEmail || user?.email || "N/A",
        userPhone:        req.userPhone || user?.phone || "N/A",
        contractorName:   req.contractorName,
        projectTitle:     req.projectTitle,
        description:      req.description,
        location:         req.location,
        timeline:         req.timeline,
        userBudget:       req.budget,
        proposedCost:     req.proposedCost,
        adminRevenue,
        contractorAmount,
        paymentId:        req.paymentId,
        receiptNumber:    "RCP-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        paidAt:           req.createdAt,
      });

      await receipt.save();
      console.log(`✅ Receipt created for: ${req.projectTitle} (Payment: ${req.paymentId})`);
      added++;
    }

    console.log(`\nDone. Added: ${added}, Skipped: ${skipped}`);
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
