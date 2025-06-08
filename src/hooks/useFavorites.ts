import { useState, useEffect } from 'react';
import type { Dog } from '../types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Dog[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [previousMatches, setPreviousMatches] = useState<Dog[]>(() => {
    const saved = localStorage.getItem('previousMatches');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('previousMatches', JSON.stringify(previousMatches));
  }, [previousMatches]);

  const toggleFavorite = (dog: Dog) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === dog.id);
      if (isFavorite) {
        return prev.filter(fav => fav.id !== dog.id);
      } else {
        return [...prev, dog];
      }
    });
  };

  const removeFavorite = (dogId: string) => {
    setFavorites(prev => prev.filter(dog => dog.id !== dogId));
  };

  const clearAll = () => {
    setFavorites([]);
  };

  const isFavorite = (dogId: string) => {
    return favorites.some(fav => fav.id === dogId);
  };

  const addMatch = (dog: Dog) => {
    setPreviousMatches(prev => {
      // Remove if already exists to avoid duplicates
      const filtered = prev.filter(match => match.id !== dog.id);
      // Add to the beginning of the array
      return [dog, ...filtered];
    });
  };

  const clearMatches = () => {
    setPreviousMatches([]);
  };

  return {
    favorites,
    previousMatches,
    toggleFavorite,
    removeFavorite,
    clearAll,
    isFavorite,
    addMatch,
    clearMatches
  };
} 