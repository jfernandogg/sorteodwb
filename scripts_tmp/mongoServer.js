"use strict";

const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/sorteodb';
let client;
let clientPromise = global._mongoClientPromise;

if (!clientPromise) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
  global._mongoClientPromise = clientPromise;
}

module.exports = {
  getDatabase: async () => {
    const client = await clientPromise;
    return client.db();
  }
};