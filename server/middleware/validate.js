export function validateMatchId(req, res, next) {
  const matchId = req.body.matchId || req.params.matchId;
  if (!matchId || typeof matchId !== 'string' || matchId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid match ID' });
  }
  req.matchId = matchId.trim();
  next();
}

export function validateRestaurant(req, res, next) {
  const { restaurant } = req.body;
  if (!restaurant || !restaurant.id) {
    return res.status(400).json({ error: 'Invalid restaurant data' });
  }
  next();
}