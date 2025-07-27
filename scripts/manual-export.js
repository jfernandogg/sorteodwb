const admin = require("firebase-admin");
const fs = require("fs");

// Inicializar Firebase
const serviceAccount = require("../credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
db.settings({ databaseId: 'dwbrifa' }); // 🔥 forzamos la conexión a la base correcta

async function exportAllCollections() {
  const collections = await db.listCollections();
  const exportData = {};

  for (const col of collections) {
    const snapshot = await col.get();
    exportData[col.id] = [];

    snapshot.forEach(doc => {
      exportData[col.id].push({
        _id: doc.id,
        ...doc.data(),
      });
    });
  }

  fs.writeFileSync("backup.json", JSON.stringify(exportData, null, 2));
  console.log("✅ Backup guardado en backup.json");
}

exportAllCollections().catch(console.error);
