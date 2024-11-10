import { useState, useCallback } from 'react';
import { Restaurant } from '../types/restaurant';

const API_URL = 'http://localhost:3000/api';

export function useMatch(matchId: string) {
  const [error, setError] = useState<string | null>(null);

  const initializeMatch = useCallback(async () => {
    if (!matchId.trim()) {
      setError('Match ID is required');
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId: matchId.trim() }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize match');
      }
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize match';
      setError(message);
      return null;
    }
  }, [matchId]);

  const saveLikedRestaurant = useCallback(async (restaurant: Restaurant) => {
    if (!matchId.trim()) {
      setError('Match ID is required');
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/matches/${matchId.trim()}/restaurants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurant }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save restaurant');
      }
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save restaurant';
      setError(message);
      return null;
    }
  }, [matchId]);

  const getLikedRestaurants = useCallback(async () => {
    if (!matchId.trim()) {
      setError('Match ID is required');
      return [];
    }

    try {
      const response = await fetch(`${API_URL}/matches/${matchId.trim()}/restaurants`);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch liked restaurants');
      }
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch liked restaurants';
      setError(message);
      return [];
    }
  }, [matchId]);

  return {
    initializeMatch,
    saveLikedRestaurant,
    getLikedRestaurants,
    error,
  };
}