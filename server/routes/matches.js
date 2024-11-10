import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Get match details
router.get('/:matchId', async (req, res) => {
  const { matchId } = req.params;
  await db.read();
  
  const match = db.data.matches[matchId] || { 
    likedRestaurants: [],
    users: [],
    matches: []
  };
  res.json(match);
});

// Join a match
router.post('/:matchId/join', async (req, res) => {
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

// Add liked restaurant to match
router.post('/:matchId/like', async (req, res) => {
  const { matchId } = req.params;
  const { restaurantId, userName, restaurant } = req.body;
  
  await db.read();
  
  const match = db.data.matches[matchId];
  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }
  
  // Add to user's likes if not already liked
  if (!match.userLikes[userName].includes(restaurantId)) {
    match.userLikes[userName].push(restaurantId);
    match.likedRestaurants.push(restaurantId);
    
    // Check for matches (when both users like the same restaurant)
    const otherUsers = match.users.filter(user => user !== userName);
    for (const otherUser of otherUsers) {
      if (match.userLikes[otherUser]?.includes(restaurantId)) {
        // We have a match!
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

export { router };