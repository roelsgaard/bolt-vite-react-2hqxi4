import { openDB } from 'idb';

const dbName = 'restaurantMatcher';
const dbVersion = 1;

async function initDB() {
  return openDB(dbName, dbVersion, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('matches')) {
        db.createObjectStore('matches', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('likedRestaurants')) {
        const store = db.createObjectStore('likedRestaurants', { keyPath: ['matchId', 'restaurantId'] });
        store.createIndex('byMatch', 'matchId');
      }
    },
  });
}

let db;

export async function initializeDatabase() {
  db = await initDB();
}

export async function createMatch(matchId) {
  try {
    await db.put('matches', {
      id: matchId,
      createdAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error creating match:', error);
    return false;
  }
}

export async function getMatch(matchId) {
  return db.get('matches', matchId);
}

export async function addLikedRestaurant(matchId, restaurant) {
  try {
    await db.put('likedRestaurants', {
      matchId,
      restaurantId: restaurant.id,
      restaurant,
      createdAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error adding liked restaurant:', error);
    return false;
  }
}

export async function getLikedRestaurants(matchId) {
  const restaurants = await db.getAllFromIndex('likedRestaurants', 'byMatch', matchId);
  return restaurants.map(record => record.restaurant);
}