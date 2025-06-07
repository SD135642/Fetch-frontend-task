import { useState, useEffect } from 'react';
import type { Dog } from '../types';
import Button from './Button';

interface MatchPopupProps {
  matchedDog: Dog | null;
  onClose: () => void;
  onAdopt: () => void;
}

export default function MatchPopup({ matchedDog, onClose, onAdopt }: MatchPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  if (!matchedDog) return null;

  return (
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
        zIndex: 2000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '25px 40px',
          maxWidth: '400px',
          width: '90%',
          position: 'relative',
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 0.3s ease',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="modal-close-button"
          style={{ top: '15px', right: '15px' }}
        >
          ×
        </button>

        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <h2 style={{ color: 'rgb(11, 118, 11)', marginBottom: '8px', fontSize: '24px' }}>It's a Match! 🎉</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>We've found your perfect companion!</p>
        </div>

        <div style={{ 
          width: '100%',
          position: 'relative',
          marginBottom: '15px',
          borderRadius: '15px',
          overflow: 'hidden',
          padding: '0 20px'
        }}>
          <img 
            src={matchedDog.img} 
            alt={matchedDog.name}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'contain',
              maxHeight: '250px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{matchedDog.name}</h3>
          <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>Breed: {matchedDog.breed}</p>
          <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>Age: {matchedDog.age} years</p>
          <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>Location: {matchedDog.zip_code}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={onAdopt}
            style={{
              backgroundColor: 'rgb(11, 118, 11)',
              color: 'white',
              padding: '10px 25px',
              fontSize: '16px',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'normal',
              borderRadius: '25px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Adopt Now
          </Button>
        </div>
      </div>
    </div>
  );
} 