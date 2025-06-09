import { useState, useRef, useEffect } from 'react';
import type { Dog } from '../types';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import MatchPopup from './MatchPopup';

interface FavoritesCartProps {
  favorites: Dog[];
  previousMatches: Dog[];
  onRemoveFavorite: (dogId: string) => void;
  onClearAll: () => void;
  onClearMatches: () => void;
  onAddMatch: (dog: Dog) => void;
}

export default function FavoritesCart({ 
  favorites, 
  previousMatches,
  onRemoveFavorite, 
  onClearAll,
  onClearMatches,
  onAddMatch
}: FavoritesCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [activeTab, setActiveTab] = useState<'favorites' | 'matches'>('favorites');
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
    // Close the cart
    setIsOpen(false);
    
    const startTime = Date.now();
    
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
      
      // Calculate remaining time to ensure 3 seconds minimum
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - elapsedTime);
      
      // Wait for remaining time if needed
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      if (matchedDog) {
        setMatchedDog(matchedDog);
        // Add to previous matches
        onAddMatch(matchedDog);
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

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          top: '12px',
          right: '12px',
          padding: '6px 10px',
          backgroundColor: 'rgb(11, 118, 11)',
          color: 'white',
          border: 'none',
          borderRadius: '18px',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1000,
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgb(255, 140, 0)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgb(11, 118, 11)'}
      >
        <span style={{ 
          fontSize: '14px',
          paddingBottom: '2px',
          lineHeight: 1
        }}>★</span>
        Favorites ({favorites.length})
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div
            ref={modalRef}
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '20px',
              width: '90%',
              maxWidth: '600px',
              height: '600px',
              overflow: 'auto',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="modal-close-button"
            >
              ×
            </button>

            <div style={{ 
              marginBottom: '20px',
              height: 'calc(100% - 40px)'
            }}>
              <div style={{ 
                display: 'flex', 
                borderBottom: '1px solid #eee',
                marginBottom: '20px'
              }}>
                <button
                  onClick={() => setActiveTab('favorites')}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    borderBottom: activeTab === 'favorites' ? '2px solid rgb(11, 118, 11)' : 'none',
                    color: activeTab === 'favorites' ? 'rgb(11, 118, 11)' : '#666',
                    fontWeight: activeTab === 'favorites' ? 'bold' : 'normal'
                  }}
                >
                  Favorites ({favorites.length})
                </button>
                <button
                  onClick={() => setActiveTab('matches')}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    borderBottom: activeTab === 'matches' ? '2px solid rgb(11, 118, 11)' : 'none',
                    color: activeTab === 'matches' ? 'rgb(11, 118, 11)' : '#666',
                    fontWeight: activeTab === 'matches' ? 'bold' : 'normal'
                  }}
                >
                  Previous Matches ({previousMatches.length})
                </button>
              </div>

              {activeTab === 'favorites' ? (
                <>
                  {favorites.length === 0 ? (
                    <div style={{ 
                      textAlign: 'center', 
                      color: '#666', 
                      padding: '20px',
                      height: 'calc(100% - 60px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      No favorites yet. Add some dogs to your favorites!
                    </div>
                  ) : (
                    <div style={{ 
                      height: 'calc(100% - 60px)',
                      overflowY: 'auto'
                    }}>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '20px',
                        marginBottom: '20px'
                      }}>
                        {favorites.map(dog => (
                          <div
                            key={dog.id}
                            style={{
                              position: 'relative',
                              padding: '15px',
                              border: '1px solid #eee',
                              borderRadius: '8px',
                              transition: 'all 0.3s ease',
                              opacity: removingId === dog.id ? 0.5 : 1
                            }}
                          >
                            <div style={{
                              width: '100%',
                              height: '200px',
                              marginBottom: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              borderRadius: '4px'
                            }}>
                              <img
                                src={dog.img}
                                alt={dog.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain'
                                }}
                              />
                            </div>
                            <div>
                              <h3 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{dog.name}</h3>
                              <p style={{ margin: '0 0 2px 0', color: '#666', fontSize: '12px' }}>{dog.breed}</p>
                              <p style={{ margin: 0, fontSize: '12px' }}>Age: {dog.age}</p>
                              <p style={{ margin: '2px 0 0 0', fontSize: '12px' }}>Zip: {dog.zip_code}</p>
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
                      <div style={{ 
                        borderTop: '1px solid #eee',
                        paddingTop: '20px',
                        marginBottom: '20px'
                      }}>
                        <Button
                          onClick={generateMatch}
                          variant="secondary"
                          className="match-button"
                          style={{ marginBottom: '20px' }}
                        >
                          Generate a Match!
                        </Button>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'center'
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
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {previousMatches.length === 0 ? (
                    <div style={{ 
                      textAlign: 'center', 
                      color: '#666', 
                      padding: '20px',
                      height: 'calc(100% - 60px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      No previous matches yet. Generate a match to see your results here!
                    </div>
                  ) : (
                    <div style={{ 
                      height: 'calc(100% - 60px)',
                      overflowY: 'auto'
                    }}>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '20px',
                        marginBottom: '20px'
                      }}>
                        {previousMatches.map(dog => (
                          <div
                            key={dog.id}
                            style={{
                              position: 'relative',
                              padding: '15px',
                              border: '1px solid #eee',
                              borderRadius: '8px',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <div style={{
                              width: '100%',
                              height: '200px',
                              marginBottom: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              borderRadius: '4px'
                            }}>
                              <img
                                src={dog.img}
                                alt={dog.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain'
                                }}
                              />
                            </div>
                            <div>
                              <h3 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{dog.name}</h3>
                              <p style={{ margin: '0 0 2px 0', color: '#666', fontSize: '12px' }}>{dog.breed}</p>
                              <p style={{ margin: 0, fontSize: '12px' }}>Age: {dog.age}</p>
                              <p style={{ margin: '2px 0 0 0', fontSize: '12px' }}>Zip: {dog.zip_code}</p>
                              <Button
                                onClick={() => {
                                  window.open(`https://www.petfinder.com/search/dogs-for-adoption/?breed=${encodeURIComponent(dog.breed)}&location=${dog.zip_code}`, '_blank');
                                }}
                                variant="primary"
                                style={{ 
                                  backgroundColor: 'rgb(11, 118, 11)',
                                  color: 'white',
                                  border: 'none',
                                  padding: '8px 16px',
                                  borderRadius: '18px',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  transition: 'all 0.2s ease',
                                  marginTop: '10px',
                                  width: '60%',
                                  marginLeft: 'auto',
                                  marginRight: 'auto',
                                  display: 'block'
                                }}
                                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                                  e.currentTarget.style.backgroundColor = 'rgb(255, 140, 0)';
                                }}
                                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                                  e.currentTarget.style.backgroundColor = 'rgb(11, 118, 11)';
                                }}
                              >
                                Adopt Now
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ 
                        borderTop: '1px solid #eee',
                        paddingTop: '20px',
                        marginBottom: '20px'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'center'
                        }}>
                          <Button
                            onClick={() => {
                              onClearMatches();
                            }}
                            variant="secondary"
                          >
                            Clear All Matches
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isLoading && <LoadingSpinner />}
      
      {matchedDog && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}
          onClick={(e) => {
            // Only close if clicking the backdrop, not the modal content
            if (e.target === e.currentTarget) {
              setMatchedDog(null);
            }
          }}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            maxWidth: '500px',
            width: '90%'
          }}>
            <div style={{
              width: '100%',
              height: '300px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderRadius: '8px'
            }}>
              <img
                src={matchedDog.img}
                alt={matchedDog.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
            <h3 style={{ color: 'rgb(11, 118, 11)', margin: '0 0 10px 0' }}>Your Perfect Match!</h3>
            <p style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{matchedDog.name}</p>
            <p style={{ margin: '0 0 5px 0', color: '#666' }}>{matchedDog.breed}</p>
            <p style={{ margin: '0 0 5px 0' }}>Age: {matchedDog.age}</p>
            <p style={{ margin: '0 0 20px 0' }}>Zip: {matchedDog.zip_code}</p>
            <Button
              onClick={() => {
                const searchQuery = encodeURIComponent(`${matchedDog.breed} dog adoption ${matchedDog.zip_code}`);
                window.open(`https://www.petfinder.com/search/dogs-for-adoption/?breed=${encodeURIComponent(matchedDog.breed)}&location=${matchedDog.zip_code}`, '_blank');
              }}
              variant="primary"
              style={{ 
                backgroundColor: 'rgb(11, 118, 11)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '18px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = 'rgb(255, 140, 0)';
              }}
              onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = 'rgb(11, 118, 11)';
              }}
            >
              Adopt Now
            </Button>
          </div>
        </div>
      )}
    </>
  );
} 