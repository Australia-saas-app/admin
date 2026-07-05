const fs = require("fs");
const path = require("path");

// Ensures the app router client-reference manifest exists for the dashboard group
const target = path.join(
  process.cwd(),
  ".next",
  "server",
  "app",
  "(WithCommonLayout)",
  "(dashboard)",
  "page_client-reference-manifest.js"
);

fs.mkdirSync(path.dirname(target), { recursive: true });

if (!fs.existsSync(target)) {
  // Minimal stub satisfies Vercel packaging expectations
  fs.writeFileSync(target, "module.exports = {}\n");
  console.log("Created missing client reference manifest:", target);
} else {
  console.log("Client reference manifest already present:", target);
}
