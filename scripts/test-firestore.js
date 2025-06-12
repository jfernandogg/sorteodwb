// Cargar variables de entorno desde .env.local
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const { firestore } = require('../scripts_tmp/firebaseServer.js');

async function test() {
  try {
    const snapshot = await firestore.collection('raffleTickets').limit(1).get();
    console.log('snapshot.empty:', snapshot.empty);
    snapshot.forEach(doc => {
      console.log('Doc:', doc.id, doc.data());
    });
  } catch (err) {
    console.error('Firestore error:', err);
  }
}

test();