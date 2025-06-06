import { useEffect, useState } from 'react';
import type { Dog } from '../types';


export default function SearchPage() {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [dogIds, setDogIds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [from, setFrom] = useState(0); // pagination cursor
  const [nextQuery, setNextQuery] = useState<string | null>(null);
  const [prevQuery, setPrevQuery] = useState<string | null>(null);


  useEffect(() => {
    const fetchBreeds = async () => {
      const res = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setBreeds(data);
      } else {
        alert('Failed to fetch breeds');
      }
    };

    fetchBreeds();
  }, []);

  useEffect(() => {
    const fetchDogIds = async () => {
      try {
        // Build search params
        const params = new URLSearchParams();
        if (selectedBreed) params.append('breeds', selectedBreed);
        params.append('size', '25');
        params.append('from', from.toString());
        params.append('sort', `breed:${sortOrder}`);

        const url = `https://frontend-take-home-service.fetch.com/dogs/search?${params.toString()}`;

        const res = await fetch(url, {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setDogIds(data.resultIds);
          setTotalResults(data.total);
          setNextQuery(data.next ?? null);
          setPrevQuery(data.prev ?? null);
        } else {
          alert('Failed to fetch dogs');
        }
      } catch (error) {
        alert('Error fetching dogs');
      }
    };

    fetchDogIds();
  }, [selectedBreed, sortOrder, from]);

  useEffect(() => {
    if (dogIds.length === 0) {
      setDogs([]);
      return;
    }

    const fetchDogs = async () => {
      try {
        const res = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dogIds),
        });

        if (res.ok) {
          const data: Dog[] = await res.json();

          // Reorder dogs to match dogIds order
          const dogMap = new Map(data.map(dog => [dog.id, dog]));
          const orderedDogs = dogIds.map(id => dogMap.get(id)).filter(Boolean) as Dog[];

          setDogs(orderedDogs);
        } else {
          alert('Failed to fetch dog details');
        }
      } catch (error) {
        alert('Error fetching dog details');
      }
    };

    fetchDogs();
  }, [dogIds]);

  // Pagination handlers
  const goNext = () => {
    if (nextQuery) {
      const urlParams = new URLSearchParams(nextQuery);
      setFrom(Number(urlParams.get('from') ?? 0));
    }
  };

  const goPrev = () => {
    if (prevQuery) {
      const urlParams = new URLSearchParams(prevQuery);
      setFrom(Number(urlParams.get('from') ?? 0));
    }
  };

  return (
    <div>
      <div className="search-wrapper" style={{ position: 'relative' }}>
        <div className="white-box-search">
        <div className="green-semi-circle" style={{ width: '120px', height: '120px' }}></div>
        <div className="green-diagonal-line" style={{ width: '250px', height: '40px' }}></div>
          <div className="adopt-header">
            Adopt A Dog
          </div>

          <div className="row">
            <label htmlFor="breed" className="custom-label">Filter by Breed:</label>
            <select
              id="breed"
              value={selectedBreed}
              onChange={(e) => setSelectedBreed(e.target.value)}
              className="custom-select"
            >
              <option value="">All Breeds</option>
              {breeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
            <label htmlFor="sort" className="custom-label">Sort by:</label>
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="custom-select"
            >
              <option value="asc">Breed A to Z</option>
              <option value="desc">Breed Z to A</option>
            </select>
          </div>
        </div>
      </div>
        <div style={{ 
          marginTop: '16px', 
          marginBottom: '15px', 
          textAlign: 'left',
        }}>
          Total Results: {totalResults}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '50px',
          }}
        >
          {dogs.map(dog => (
            <div
              key={dog.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '10px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              <img src={dog.img} alt={dog.name} style={{ width: '100%', borderRadius: '6px' }} />
              <h3>{dog.name}</h3>
              <p>Breed: {dog.breed}</p>
              <p>Age: {dog.age}</p>
              <p>Zip Code: {dog.zip_code}</p>
            </div>
          ))}
        </div>


        <div style={{ marginTop: '16px' }}>
          <button 
            onClick={goPrev} 
            disabled={!prevQuery} 
            style={{ 
              borderRadius: '18px 0 0 18px',
            }}>
            Previous
          </button>
          <button onClick={goNext} disabled={!nextQuery}>
            Next
          </button>
          <span style={{ 
            borderRadius: '0 18px 18px 0',
          }}>
          </span>
      </div>
    </div>
  );
}
