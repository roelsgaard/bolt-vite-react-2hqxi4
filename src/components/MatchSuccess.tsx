import React from 'react';
import { ArrowLeft, Heart, Star, MapPin } from 'lucide-react';
import { Restaurant } from '../types/restaurant';

interface MatchSuccessProps {
  matches: { restaurantId: string; users: string[] }[];
  restaurants: Restaurant[];
  users: string[];
  onBack: () => void;
}

export function MatchSuccess({ matches, restaurants, users, onBack }: MatchSuccessProps) {
  // Find the matched restaurant from our restaurants array
  const matchedRestaurant = restaurants.find(r => r.id === matches[0].restaurantId);

  if (!matchedRestaurant) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center text-pink-600 hover:text-pink-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Start New Match
        </button>

        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="relative">
              <img
                src={matchedRestaurant.imageUrl}
                alt={matchedRestaurant.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Heart className="w-20 h-20 mx-auto mb-4 text-pink-500 fill-pink-500" />
                  <h2 className="text-3xl font-bold mb-2">It's a Match!</h2>
                  <p className="text-lg opacity-90">
                    {users.join(' & ')} both liked this restaurant
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {matchedRestaurant.name}
              </h3>
              <p className="text-gray-600 text-lg mb-4">{matchedRestaurant.cuisine}</p>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium">{matchedRestaurant.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-1" />
                  <span>{matchedRestaurant.vicinity}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">What's Next?</h4>
                <p className="text-gray-600 mb-4">
                  Why not plan a visit together? You can:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Share your contact details</li>
                  <li>Pick a date and time</li>
                  <li>Make a reservation</li>
                </ul>
              </div>

              <div className="mt-6">
                <button
                  onClick={onBack}
                  className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-4 rounded-md hover:from-pink-600 hover:to-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                >
                  Start New Match
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}