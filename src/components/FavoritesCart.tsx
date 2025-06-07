import { useState, useRef, useEffect } from 'react';
import type { Dog } from '../types';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import MatchPopup from './MatchPopup';

interface FavoritesCartProps {
  favorites: Dog[];
  onRemoveFavorite: (dogId: string) => void;
  onClearAll: () => void;
}

export default function FavoritesCart({ favorites, onRemoveFavorite, onClearAll }: FavoritesCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleRemove = (dogId: string) => {
    setRemovingId(dogId);
    setTimeout(() => {
      onRemoveFavorite(dogId);
      setRemovingId(null);
    }, 1000);
  };

  const generateMatch = async () => {
    if (favorites.length === 0) return;
    
    setIsLoading(true);
    // Clear favorites immediately
    onClearAll();
    
    try {
      // Get match from API
      const matchRes = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(favorites.map(dog => dog.id)),
      });

      if (!matchRes.ok) throw new Error('Failed to generate match');

      const { match } = await matchRes.json();
      
      // Find the matched dog from favorites
      const matchedDog = favorites.find(dog => dog.id === match);
      if (matchedDog) {
        setMatchedDog(matchedDog);
      }
    } catch (error) {
      console.error('Error generating match:', error);
      alert('Failed to generate match. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdopt = () => {
    window.open('https://www.petfinder.com/dogs-and-puppies/', '_blank');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: 'rgb(11, 118, 11)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            paddingBottom: '5px'
          }}
        >
          <span style={{ fontSize: '24px' }}>★</span>
          {favorites.length > 0 && (
            <span style={{
              position: 'absolute',
              top: -5,
              right: -5,
              backgroundColor: 'white',
              color: 'rgb(11, 118, 11)',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {favorites.length}
            </span>
          )}
        </button>
      </div>

      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }}>
          <div 
            ref={modalRef}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              width: '80%',
              maxWidth: '800px',
              maxHeight: '80vh',
              overflowY: 'auto',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="modal-close-button"
            >
              ×
            </button>
            
            <h2 style={{ margin: '0 0 20px 0', color: 'rgb(11, 118, 11)' }}>Favorite Dogs</h2>
            
            {favorites.length === 0 ? (
              <p>No favorites yet</p>
            ) : (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '50px',
                  padding: '60px'
                }}>
                  {favorites.map(dog => (
                    <div 
                      key={dog.id} 
                      style={{
                        border: '1px solid #eee',
                        borderRadius: '8px',
                        padding: '15px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        position: 'relative',
                        transition: 'all 0.5s ease',
                        opacity: removingId === dog.id ? 0.5 : 1
                      }}
                    >
                      <div style={{ 
                        width: '100%',
                        height: 'auto',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '4px'
                      }}>
                        <img 
                          src={dog.img} 
                          alt={dog.name} 
                          style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center'
                          }} 
                        />
                      </div>
                      <div>
                        <h3 style={{ margin: '0 0 5px 0' }}>{dog.name}</h3>
                        <p style={{ margin: '0 0 5px 0', color: '#666' }}>{dog.breed}</p>
                        <p style={{ margin: 0 }}>Age: {dog.age}</p>
                        <p style={{ margin: '5px 0 0 0' }}>Zip: {dog.zip_code}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(dog.id)}
                        style={{
                          background: 'none',
                          border: '2px solid rgb(11, 118, 11)',
                          color: removingId === dog.id ? '#999' : 'rgb(11, 118, 11)',
                          cursor: 'pointer',
                          fontSize: '20px',
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingBottom: 4,
                          position: 'absolute',
                          bottom: '15px',
                          right: '15px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        ★
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={generateMatch}
                  variant="secondary"
                  className="match-button"
                >
                  Generate a Match!
                </Button>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginTop: '30px',
                  paddingTop: '20px',
                  borderTop: '1px solid #eee'
                }}>
                  <Button
                    onClick={() => {
                      onClearAll();
                      setIsOpen(false);
                    }}
                    variant="secondary"
                  >
                    Clear All Favorites
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {isLoading && <LoadingSpinner />}
      
      {matchedDog && (
        <MatchPopup
          matchedDog={matchedDog}
          onClose={() => setMatchedDog(null)}
          onAdopt={handleAdopt}
        />
      )}
    </>
  );
} 