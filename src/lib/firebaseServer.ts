import clientPromise from './mongoServer';

export const getDatabase = async () => {
  const client = await clientPromise;
  return client.db();
};
