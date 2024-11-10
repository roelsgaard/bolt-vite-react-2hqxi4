import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Heart } from 'lucide-react';
import { RestaurantCard } from './components/RestaurantCard';
import { useNearbyRestaurants } from './hooks/useNearbyRestaurants';
import { LoadingSpinner } from './components/LoadingSpinner';
import { MatchSuccess } from './components/MatchSuccess';

const API_URL = import.meta.env.PROD 
  ? '/.netlify/functions/api'
  : 'http://localhost:3000/api';

export function App() {
  const [matchId, setMatchId] = useState('');
  const [userName, setUserName] = useState('');
  const [radius, setRadius] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedRestaurants, setLikedRestaurants] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<{ restaurantId: string, users: string[] }[]>([]);

  const { restaurants, loading: restaurantsLoading, error: restaurantsError } = useNearbyRestaurants(radius);

  useEffect(() => {
    if (isSubmitted && matchId) {
      fetch(`${API_URL}/matches/${matchId}`)
        .then(res => res.json())
        .then(data => {
          setLikedRestaurants(data.likedRestaurants || []);
          setMatches(data.matches || []);
        })
        .catch(err => {
          setError('Failed to fetch match data');
          console.error(err);
        });
    }
  }, [isSubmitted, matchId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/matches/${matchId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to join match');
      }
      
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to join match');
      console.error(err);
    }
  };

  const handleBack = () => {
    setIsSubmitted(false);
    setCurrentIndex(0);
    setLikedRestaurants([]);
    setError(null);
    setMatches([]);
  };

  const handleLike = async () => {
    const restaurant = restaurants[currentIndex];
    try {
      const response = await fetch(`${API_URL}/matches/${matchId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          restaurantId: restaurant.id,
          userName,
          restaurant,
        }),
      });
      const data = await response.json();
      setLikedRestaurants(data.likedRestaurants);
      setMatches(data.matches || []);
    } catch (err) {
      setError('Failed to save like');
      console.error(err);
    }

    if (currentIndex < restaurants.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDislike = () => {
    if (currentIndex < restaurants.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (matches.length > 0) {
    return (
      <MatchSuccess 
        matches={matches} 
        restaurants={restaurants} 
        users={matches[0].users} 
        onBack={handleBack}
      />
    );
  }

  if (!isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-center mb-6">
                <Heart className="w-12 h-12 text-pink-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Find Restaurants
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="userName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="matchId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Match ID
                  </label>
                  <input
                    type="text"
                    id="matchId"
                    value={matchId}
                    onChange={(e) => setMatchId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    placeholder="Enter match ID"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="radius"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Search Radius (km)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      id="radius"
                      min="1"
                      max="20"
                      value={radius}
                      onChange={(e) => setRadius(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-gray-600 w-12">{radius}km</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Uses your current location</span>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                >
                  Start Matching
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleBack}
          className="flex items-center text-pink-600 hover:text-pink-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Change Match ID
        </button>

        {error && (
          <div className="max-w-sm mx-auto mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="relative max-w-sm mx-auto h-[600px]">
          {restaurantsLoading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : restaurantsError ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
              <p className="text-gray-600">{restaurantsError}</p>
            </div>
          ) : currentIndex < restaurants.length ? (
            restaurants.slice(currentIndex).map((restaurant, index) => (
              <RestaurantCard
                key={restaurant.id}
                {...restaurant}
                onLike={handleLike}
                onDislike={handleDislike}
                isActive={index === 0}
              />
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No More Restaurants</h2>
              <p className="text-gray-600 mb-6">You've viewed all available restaurants!</p>
              <p className="text-gray-600">
                Liked restaurants: {likedRestaurants.length}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}