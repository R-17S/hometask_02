// import { MongoMemoryServer } from 'mongodb-memory-server';
// import { MongoClient, Db } from 'mongodb';
// import {SETTINGS} from "../../src/settings";
//
// let mongoServer: MongoMemoryServer;
// let client: MongoClient;
// let testDb: Db
//
// // Запуск тестовой MongoDB
// export async function startTestDb(): Promise<Db> {
//     mongoServer = await MongoMemoryServer.create();
//     const uri = mongoServer.getUri();
//     client = new MongoClient(uri);
//
//     await client.connect();
//     console.log('Test MongoDB server started');
//     return client.db(SETTINGS.DB.NAME); // Используем имя базы из настроек
// }
//
// // Получение коллекций
// export function getCollections() {
//     const db = client.db(SETTINGS.DB.NAME);
//     return {
//         blogs: db.collection(SETTINGS.DB.COLLECTION.BLOGS),
//         posts: db.collection(SETTINGS.DB.COLLECTION.POSTS),
//         users: db.collection(SETTINGS.DB.COLLECTION.USERS),
//         comments: db.collection(SETTINGS.DB.COLLECTION.COMMENTS)
//     };
// }
//
// // Очистка коллекций
// export async function clearTestDb(): Promise<void> {
//     const db = client.db(SETTINGS.DB.NAME);
//     const collections = await db.collections();
//     for (const collection of collections) {
//         await collection.deleteMany({});
//     }
//     console.log('Test database cleared');
// }

// Остановка тестовой MongoDB
// export async function stopTestDb(): Promise<void> {
//     await client?.close();
//     await mongoServer?.stop();
//     console.log('Test MongoDB server stopped');
// }
