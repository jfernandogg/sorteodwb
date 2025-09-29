// scripts/check-counter.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const { getDatabase } = require('../scripts_tmp/mongoServer');
const { ObjectId } = require('mongodb');

async function main() {
  try {
    console.log('Conectando a MongoDB...');
    const db = await getDatabase();
    
    console.log('Consultando contador...');
    const counter = await db.collection('meta').findOne({
      _id: new ObjectId('000000000000000000000001')
    });
    
    if (!counter) {
      console.error('ERROR: No se encontró el documento del contador');
      console.log('Sugerencia: Ejecutar scripts/init-raffleTickets.js para inicializar la base de datos');
      process.exit(1);
    }

    console.log('\n=== ESTADO DEL CONTADOR ===');
    console.log('Valor actual:', counter.ticketCounter || 'NO INICIALIZADO');
    console.log('Fecha de inicialización:', counter.initialized || 'NO INICIALIZADO');
    console.log('===========================');
    
  } catch (err) {
    console.error('ERROR verificando contador:');
    console.error(err.message);
    console.log('\nPosibles soluciones:');
    console.log('1. Verificar que MongoDB esté corriendo');
    console.log('2. Confirmar la URI de conexión en .env.local');
    console.log('3. Ejecutar scripts/init-raffleTickets.js para inicializar la base de datos');
    process.exit(1);
  }
}

main();