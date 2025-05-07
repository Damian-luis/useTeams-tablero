import { MongoClient } from 'mongodb';
import { mockBoard } from '../mocks/boardData';

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://damianluisporta:vExUbpuEYyEzKAZu@kamba.wii29vf.mongodb.net/kanban';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    const db = client.db();
    console.log('Base de datos seleccionada:', db.databaseName);
    
    // Clear existing data
    await db.collection('boards').deleteMany({});
    console.log('Datos existentes eliminados');
    
    // Insert mock data with the correct collection name
    await db.collection('boards').insertOne({
      ...mockBoard,
      __v: 0
    });
    console.log('Datos de prueba insertados');
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seed(); 