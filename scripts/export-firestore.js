// scripts/export-firestore.js
const { backup } = require("firestore-export-import");
const fs = require("fs");
const serviceAccount = require("../credentials.json"); // o ajusta la ruta

async function run() {
  try {
    const data = await backup(serviceAccount, { stringify: true });
    fs.writeFileSync("backup.json", JSON.stringify(data, null, 2));
    console.log("✅ Exportación completa a backup.json");
  } catch (err) {
    console.error("❌ Error exportando Firestore:", err);
  }
}

run();
