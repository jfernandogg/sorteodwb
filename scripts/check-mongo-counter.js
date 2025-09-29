// scripts/check-mongo-counter.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const { MongoClient } = require('mongodb');

async function main() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/sorteodb';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    
    const counter = await db.collection('meta').findOne({
      _id: new (require('mongodb')).ObjectId('000000000000000000000001')
    });
    
    console.log('Estado del contador:', counter ? counter : 'NO EXISTE');
    if (counter) {
      console.log('Valor actual:', counter.ticketCounter);
    }
  } catch (err) {
    console.error('Error verificando contador:', err);
  } finally {
    await client.close();
  }
}

main();