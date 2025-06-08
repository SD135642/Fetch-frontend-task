import type { Dog } from '../types';

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: (dog: Dog) => void;
}

export default function DogCard({ dog, isFavorite, onToggleFavorite }: DogCardProps) {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minHeight: '400px'
      }}
    >
      <div style={{ 
        width: '100%',
        height: 'auto',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '6px'
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
        <h3>{dog.name}</h3>
        <p>Breed: {dog.breed}</p>
        <p>Age: {dog.age}</p>
        <p>Zip Code: {dog.zip_code}</p>
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={() => onToggleFavorite(dog)}
          className="favorite-button"
          style={{
            color: isFavorite ? 'rgb(11, 118, 11)' : 'rgb(167, 170, 167)'
          }}
        >
          Add Me to Favorites! ★
        </button>
      </div>
    </div>
  );
} 