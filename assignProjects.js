/**
 * assignProjects.js
 * Distributes existing projects (with no contractorId) across contractors.
 * Tries to match by specialization keyword, falls back to round-robin.
 * Run: node assignProjects.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Contractor = require("./models/Contractor");
const Projects = require("./models/Projects");

const SPECIALIZATION_KEYWORDS = {
  civil: ["civil", "building", "construction", "residential", "commercial", "infrastructure"],
  electrical: ["electrical", "wiring", "power", "solar", "lighting"],
  plumbing: ["plumbing", "water", "pipeline", "drainage", "sanitation"],
  interior: ["interior", "design", "renovation", "decor", "flooring"],
  mechanical: ["mechanical", "hvac", "ventilation", "cooling", "heating"],
  structural: ["structural", "bridge", "road", "highway", "metro", "tunnel"],
};

function matchSpecialization(project, contractor) {
  const spec = (contractor.specialization || "").toLowerCase();
  const title = (project.title || "").toLowerCase();
  const desc = (project.description || "").toLowerCase();
  const text = title + " " + desc;

  for (const [key, keywords] of Object.entries(SPECIALIZATION_KEYWORDS)) {
    const specMatches = keywords.some(k => spec.includes(k));
    const projectMatches = keywords.some(k => text.includes(k));
    if (specMatches && projectMatches) return true;
  }
  return false;
}

async function main() {
  await mongoose.connect("mongodb://localhost:27017/testdb");
  console.log("Connected to MongoDB ✅");

  const contractors = await Contractor.find({ status: "active" });
  if (contractors.length === 0) {
    console.log("No active contractors found.");
    process.exit(0);
  }

  // Get projects that have no contractorId assigned
  const unassigned = await Projects.find({
    $or: [{ contractorId: null }, { contractorId: { $exists: false } }]
  });

  console.log(`Found ${contractors.length} contractors, ${unassigned.length} unassigned projects.\n`);

  if (unassigned.length === 0) {
    console.log("All projects already have a contractor assigned.");
    process.exit(0);
  }

  let rrIndex = 0;
  const assignmentLog = [];

  for (const project of unassigned) {
    // Try specialization match first
    let assigned = contractors.find(c => matchSpecialization(project, c));

    // Fall back to round-robin
    if (!assigned) {
      assigned = contractors[rrIndex % contractors.length];
      rrIndex++;
    }

    await Projects.findByIdAndUpdate(project._id, {
      contractorId: assigned._id,
      contractorName: assigned.name,
    });

    assignmentLog.push(`  "${project.title}" → ${assigned.name} (${assigned.specialization || "General"})`);
  }

  console.log("Assignments made:");
  assignmentLog.forEach(l => console.log(l));
  console.log(`\n✅ Done. ${unassigned.length} projects assigned.`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
