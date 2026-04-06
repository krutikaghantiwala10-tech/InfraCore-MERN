require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const contractorRoutes = require("./routes/contractorRoutes");
const projectRoutes = require("./routes/projectRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const contactsRoutes = require("./routes/contactsRoutes");
const hireRequestRoutes = require("./routes/hireRequestRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const receiptRoutes = require("./routes/receiptRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Uploads folder
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use("/uploads", express.static(uploadsDir));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
app.locals.upload = upload;

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/testdb")
.then(() => console.log("MongoDB Connected ✅"))
.catch((err) => console.log(err));

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is Running");
});

app.use("/admins", adminRoutes);
app.use("/users", userRoutes);
app.use("/contractors", contractorRoutes);
app.use("/projects", projectRoutes);
app.use("/feedbacks", feedbackRoutes);
app.use("/contacts", contactsRoutes);
app.use("/hire-requests", hireRequestRoutes);
app.use("/payment", paymentRoutes);
app.use("/receipts", receiptRoutes);

app.listen(5001, () => {
  console.log("Server running on port 5001 🔥");
});

// app.get("/admins", async (req, res) => {
//   try {
//     const admins = await Admin.find();
//     res.json(admins);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });



// app.get("/users", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.get("/contractors", async (req, res) => {
//     try {
//         const contractors = await Contractor.find();
//         res.json(contractors);
//     } catch (error) {        
//         res.status(500).json({ message: error.message });
//     }
// });

// app.get("/projects", async (req, res) => {
//     try {
//         const projects = await Projects.find();
//         res.json(projects);
//     } catch (error) {        
//         res.status(500).json({ message: error.message });
//     }
// });

// app.get("/feedbacks", async (req, res) => {
//     try {
//         const feedbacks = await Feedbacks.find();
//         res.json(feedbacks);
//     } catch (error) {        
//         res.status(500).json({ message: error.message });
//     }
// });

// app.get("/dashboard-counts", async (req, res) => {
//   try {
//     const adminCount = await Admin.countDocuments();
//     const userCount = await User.countDocuments();
//     const contractorCount = await Contractor.countDocuments();
//     const projectCount = await Projects.countDocuments();
//     const feedbackCount = await Feedbacks.countDocuments();

//     res.json({
//       adminCount,
//       userCount,
//       contractorCount,
//       projectCount,
//       feedbackCount
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.put("/users/:id/disable", async (req, res) => {
//   try {

//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { status: "disabled" },
//       { new: true }
//     );

//     res.json({
//       message: "User disabled successfully",
//       user
//     });

//   } catch (error) {
//     res.status(500).json({ error: "Error disabling user" });
//   }
// });

// app.put("/users/:id/enable", async (req, res) => {
//   try {

//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { status: "active" },
//       { new: true }
//     );

//     res.json({
//       message: "User enabled successfully",
//       user
//     });

//   } catch (error) {
//     res.status(500).json({ error: "Error enabling user" });
//   }
// });

// app.put("/contractors/:id/disable", async (req, res) => {
//   try {

//     const contractor = await Contractor.findByIdAndUpdate(
//       req.params.id,
//       { status: "disabled" },
//       { new: true }
//     );

//     res.json({
//       message: "Contractor disabled successfully",
//       contractor
//     });

//   } catch (error) {
//     res.status(500).json({ error: "Error disabling contractor" });
//   }
// });

// app.put("/contractors/:id/enable", async (req, res) => {
//   try {

//     const contractor = await Contractor.findByIdAndUpdate(
//       req.params.id,
//       { status: "active" },
//       { new: true }
//     );

//     res.json({
//       message: "Contractor enabled successfully",
//       contractor
//     });

//   } catch (error) {
//     res.status(500).json({ error: "Error enabling contractor" });
//   }
// });

// app.get("/contractors/:id", async (req, res) => {
//   try {
//     const contractor = await Contractor.findById(req.params.id);
//     res.json(contractor);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.post("/contractors", async (req, res) => {
//   try {
//     const newContractor = new Contractor(req.body);
//     const savedContractor = await newContractor.save();
//     res.json(savedContractor);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.put("/contractors/:id", async (req, res) => {
//   try {
//     const updatedContractor = await Contractor.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json(updatedContractor);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.get("/admins/:id", async (req, res) => {
//   try{
//     const admin = await Admin.findById(req.params.id);
//     res.json(admin);
//   } catch (error){
//     res.status(500).json({message: error.message});
//   }
// })

// app.put("/admins/:id", async (req,res) => {
//   try {
//     const updatedAdmin = await Admin.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json(updatedAdmin);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// })

// app.post("/contractors", async (req, res) => {
//   try {
//     const newContractor = new Contractor(req.body);
//     const savedContractor = await newContractor.save();
//     res.json(savedContractor);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.put("/contractors/:id", async (req,res) => {
//   try {
//     const updatedContractor = await Contractor.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json(updatedContractor);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// })

// app.delete("/contractors/:id", async (req, res) => {
//   try {
//     await Contractor.findByIdAndDelete(req.params.id);
//     res.json({ message: "Contractor deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   } 
// });

// app.post("/users", async (req, res) => {
//   try {
//     const newUser = new User(req.body);
//     const savedUser = await newUser.save();
//     res.json(savedUser);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.delete("/users/:id", async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.json({ message: "User deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   } 
// });

// app.get("/projects/:id", async (req, res) => {
//   try {
//     const project = await Projects.findById(req.params.id);

//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     res.json(project);

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// });

// app.post("/feedbacks", async (req, res) => {
//   try {

//     console.log(req.body); 

//     const newFeedback = new Feedbacks(req.body);
//     const savedFeedback = await newFeedback.save();

//     res.json(savedFeedback);

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// });

// app.delete("/feedbacks/:id", async (req, res) => {
//   try {
//     await Feedbacks.findByIdAndDelete(req.params.id);
//     res.json({ message: "Feedback deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   } 
// });

// app.post("/ForgotPassword", async (req, res) => {
//   try {
//     const { email } = req.body;

//     const admin = await Admin.findOne({ email: email });

//     if (!admin) {
//       return res.json({ success: false, message: "Email not found" });
//     }

//     res.json({ success: true, message: "Email verified" });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.put("/ResetPassword", async (req, res) => {
//   console.log("Request Body:", req.body);

//   try {
//     const { email, password } = req.body;   // FIX: password small p

//     if (!email || !password) {
//       return res.json({
//         success: false,
//         message: "Email and password are required"
//       });
//     }

//     const admin = await Admin.findOneAndUpdate(
//       { email: email },
//       { $set: { password: password } },
//       { new: true }
//     );

//     console.log("Updated Admin:", admin);

//     if (!admin) {
//       return res.json({
//         success: false,
//         message: "Email not found"
//       });
//     }

//     res.json({
//       success: true,
//       message: "Password reset successful"
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   }
// });

// app.put("/projects/:id/approve", async (req, res) => {

//   const project = await Projects.findByIdAndUpdate(
//     req.params.id,
//     { isApproved: true },
//     { new: true }
//   );

//   res.json(project);

// });

// app.put("/projects/:id/disapprove", async (req, res) => {
//   try {

//     const project = await Projects.findByIdAndUpdate(
//       req.params.id,
//       { isApproved: false },
//       { new: true }
//     );

//     res.json(project);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.get("/approved-projects", async (req, res) => {
//   try {
//     const projects = await Projects.find({ isApproved: true });

//     res.json(projects);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.get("/users/:id", async (req, res) => {

//   try {

//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);

//   } catch (error) {

//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.put("/users/:id", async (req, res) => {

//   try { 
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json(updatedUser);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });