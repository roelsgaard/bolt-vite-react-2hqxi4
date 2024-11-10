import express, { Router } from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import serverless from 'serverless-http';

const app = express();
const router = Router();

// Initialize lowdb
const adapter = new JSONFile('/tmp/db.json');
const defaultData = {
  matches: {},
  likedRestaurants: {}
};
const db = new Low(adapter, defaultData);

// Middleware
app.use(express.json());
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Routes
router.get('/matches/:matchId', async (req, res) => {
  const { matchId } = req.params;
  await db.read();
  
  const match = db.data.matches[matchId] || { 
    likedRestaurants: [],
    users: [],
    matches: []
  };
  res.json(match);
});

router.post('/matches/:matchId/join', async (req, res) => {
  const { matchId } = req.params;
  const { userName } = req.body;
  
  await db.read();
  
  if (!db.data.matches[matchId]) {
    db.data.matches[matchId] = {
      likedRestaurants: [],
      users: [],
      userLikes: {},
      matches: []
    };
  }
  
  if (!db.data.matches[matchId].users.includes(userName)) {
    db.data.matches[matchId].users.push(userName);
    db.data.matches[matchId].userLikes[userName] = [];
    await db.write();
  }
  
  res.json(db.data.matches[matchId]);
});

router.post('/matches/:matchId/like', async (req, res) => {
  const { matchId } = req.params;
  const { restaurantId, userName, restaurant } = req.body;
  
  await db.read();
  
  const match = db.data.matches[matchId];
  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }
  
  if (!match.userLikes[userName].includes(restaurantId)) {
    match.userLikes[userName].push(restaurantId);
    match.likedRestaurants.push(restaurantId);
    
    const otherUsers = match.users.filter(user => user !== userName);
    for (const otherUser of otherUsers) {
      if (match.userLikes[otherUser]?.includes(restaurantId)) {
        match.matches.push({
          restaurantId,
          users: [userName, otherUser],
          restaurant,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    await db.write();
  }
  
  res.json(match);
});

app.use('/.netlify/functions/api', router);

export const handler = serverless(app);