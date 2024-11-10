const API_URL = 'http://localhost:3000/api';

export async function createMatch(matchId: string) {
  const response = await fetch(`${API_URL}/matches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ matchId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create match');
  }
  
  return response.json();
}

export async function saveLikedRestaurant(matchId: string, restaurant: any) {
  const response = await fetch(`${API_URL}/matches/${matchId}/restaurants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ restaurant }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save restaurant');
  }
  
  return response.json();
}

export async function getLikedRestaurants(matchId: string) {
  const response = await fetch(`${API_URL}/matches/${matchId}/restaurants`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch restaurants');
  }
  
  return response.json();
}