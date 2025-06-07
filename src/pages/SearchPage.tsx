import { useEffect, useState } from 'react';
import type { Dog } from '../types';
import Select from 'react-select';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import FavoritesCart from '../components/FavoritesCart';
import Button from '../components/Button';

export default function SearchPage() {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<{ value: string; label: string }[]>(() => {
    const saved = localStorage.getItem('selectedBreeds');
    return saved ? JSON.parse(saved) : [];
  });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'nameAsc' | 'nameDesc' | 'ageAsc' | 'ageDesc'>('asc');
  const [dogIds, setDogIds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [from, setFrom] = useState(0); // pagination cursor
  const [nextQuery, setNextQuery] = useState<string | null>(null);
  const [prevQuery, setPrevQuery] = useState<string | null>(null);
  const [ageRange, setAgeRange] = useState<[number, number]>(() => {
    const saved = localStorage.getItem('ageRange');
    return saved ? JSON.parse(saved) : [0, 10];
  });
  const [zipCodes, setZipCodes] = useState<string>(() => {
    const saved = localStorage.getItem('zipCodes');
    return saved ? saved : '';
  });
  const [favorites, setFavorites] = useState<Dog[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const breedOptions = breeds.map(breed => ({ value: breed, label: breed }));

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
        const params = new URLSearchParams();
        if (selectedBreeds.length > 0) {
          selectedBreeds.forEach(breedObj => params.append('breeds', breedObj.value));
        }
        const zipArray = zipCodes.split(/[,\s]+/).map(z => z.trim()).filter(Boolean);
        if (zipArray.length > 0) {
          zipArray.forEach(zip => params.append('zipCodes', zip));
        }
        params.append('ageMin', ageRange[0].toString());
        params.append('ageMax', ageRange[1].toString());
        params.append('size', '25');
        params.append('from', from.toString());
        
        // Handle different sort options
        let sortParam = '';
        switch (sortOrder) {
          case 'asc':
            sortParam = 'breed:asc';
            break;
          case 'desc':
            sortParam = 'breed:desc';
            break;
          case 'nameAsc':
            sortParam = 'name:asc';
            break;
          case 'nameDesc':
            sortParam = 'name:desc';
            break;
          case 'ageAsc':
            sortParam = 'age:asc';
            break;
          case 'ageDesc':
            sortParam = 'age:desc';
            break;
        }
        params.append('sort', sortParam);

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
  }, [selectedBreeds, sortOrder, from, ageRange, zipCodes]);

  // Save selected breeds to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('selectedBreeds', JSON.stringify(selectedBreeds));
  }, [selectedBreeds]);

  // Save age range to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ageRange', JSON.stringify(ageRange));
  }, [ageRange]);

  // Save zip codes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('zipCodes', zipCodes);
  }, [zipCodes]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleBreedChange = (selected: any) => {
    setSelectedBreeds(selected || []);
    setFrom(0); // Reset to first page
  };

  const handleAgeRangeChange = (range: number | number[]) => {
    if (Array.isArray(range)) {
      setAgeRange([range[0], range[1]]);
      setFrom(0); // Reset to first page
    }
  };

  // Add useEffect to handle zip code changes
  useEffect(() => {
    setFrom(0); // Reset to first page when zip codes change
  }, [zipCodes]);

  // Add useEffect to handle sort order changes
  useEffect(() => {
    setFrom(0); // Reset to first page when sort order changes
  }, [sortOrder]);

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

  return (
    <div>
      <FavoritesCart 
        favorites={favorites} 
        onRemoveFavorite={(dogId) => setFavorites(prev => prev.filter(dog => dog.id !== dogId))}
        onClearAll={() => setFavorites([])}
      />
      <div className="search-wrapper" style={{ position: 'relative' }}>
        <div className="white-box-search" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, clipPath: 'inset(0 round 8px)' }}>
            <div 
              className="green-semi-circle"
              style={{
                width: '200px',
                height: '200px',
                backgroundColor: 'rgb(11, 118, 11)',
                position: 'absolute',
                left: '100%',
                top: '10%',
                transform: 'translate(-70%, -70%)'
              }}
            ></div>
            <div 
              className="green-diagonal-line"
              style={{
                position: 'absolute',
                width: '30px',
                height: '250px',
                backgroundColor: 'rgb(11, 118, 11)',
                transform: 'rotate(-40deg)',
                left: '2%',
                top: '10%'
              }}
            ></div>
          </div>
          {/* Row 1: Header */}
          <div className="adopt-header" style={{ marginBottom: 40, marginTop: 20, marginLeft: 25 }}>
            Adopt A Dog
          </div>

          {/* Row 2: Filter Labels */}
          <div style={{ display: 'flex', paddingBottom: 10, paddingLeft: 6, flexDirection: 'row', justifyContent: 'space-between', gap: 202 }}>
            <label htmlFor="breed" className="custom-label" style={{ flex: 1, marginLeft: 20 }}>Filter by Breed:</label>
            <label className="custom-label" style={{ flex: 1 }}>Filter by Age:</label>
            <label className="custom-label" style={{ flex: 1, width: '200px' }}>Filter by Zip Code:</label>
          </div>

          {/* Row 3: Filter Controls */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 40, marginBottom: 16, position: 'relative' }}>
            <div style={{ minWidth: 320, maxWidth: 320, position: 'relative', height: 70 }}>
              <Select
                isMulti
                options={breedOptions}
                value={selectedBreeds}
                onChange={handleBreedChange}
                className="custom-zip-input"
                placeholder="Select breeds..."
                inputId="breed"
                styles={{
                  menu: (base) => ({
                    ...base,
                    maxHeight: '300px',
                    position: 'absolute',
                    zIndex: 999,
                    width: '100%'
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    maxHeight: '90px',
                    overflow: 'auto'
                  }),
                  menuList: (base) => ({
                    ...base,
                    maxHeight: '300px'
                  }),
                  container: (base) => ({
                    ...base,
                    position: 'relative'
                  }),
                  control: (base) => ({
                    ...base,
                    minHeight: '40px',
                    maxHeight: '100px'
                  })
                }}
              />
            </div>
            <div style={{ width: 280 }}>
              <Slider
                range
                min={0}
                max={10}
                value={ageRange}
                onChange={handleAgeRangeChange}
                allowCross={false}
                marks={{ 0: '0', 10: '10+' }}
                styles={{
                  track: { backgroundColor: 'rgb(11, 118, 11)', height: 8 },
                  handle: { borderColor: 'rgb(11, 118, 11)', backgroundColor: '#fff', height: 24, width: 24, marginTop: -8 },
                  rail: { backgroundColor: '#ccc', height: 8 }
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, marginLeft: 100, marginRight: 100, alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>{ageRange[0]}</span>
                <span style={{ fontWeight: 'bold' }}>-</span>
                <span style={{ fontWeight: 'bold' }}>{ageRange[1]}</span>
              </div>
            </div>
            <div style={{ minWidth: 280 }}>
              <input
                type="text"
                value={zipCodes}
                onChange={e => setZipCodes(e.target.value)}
                placeholder="e.g. 90210, 10001"
                className="custom-zip-input"
                style={{ width: '100%', borderRadius: 8, padding: '8px', fontSize: 16, border: '1px solid #ccc' }}
              />
            </div>
          </div>

          {/* Row 4: Sort By Dropdown */}
          <div style={{ position: 'sticky' }}>
            <label htmlFor="sort" className="custom-label" style={{ marginRight: 10 }}>Sort by:</label>
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | 'nameAsc' | 'nameDesc' | 'ageAsc' | 'ageDesc')}
              className="custom-select"
              style={{ minWidth: 200 }}
            >
              <option value="asc">Breed A → Z</option>
              <option value="desc">Breed Z → A</option>
              <option value="nameAsc">Name A → Z</option>
              <option value="nameDesc">Name Z → A</option>
              <option value="ageAsc">Age: Youngest to Oldest</option>
              <option value="ageDesc">Age: Oldest to Youngest</option>
            </select>
          </div>
        </div>
      </div>
        <div style={{ 
          marginTop: '20px', 
          marginBottom: '5px',
          marginLeft: '63px', 
          textAlign: 'left',
        }}>
          Total Results: {totalResults}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '40px',
            padding: '10px 60px'
          }}
        >
          {dogs.map(dog => (
            <div
              key={dog.id}
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
                  onClick={() => toggleFavorite(dog)}
                  className="favorite-button"
                  style={{
                    color: favorites.some(fav => fav.id === dog.id) ? 'rgb(11, 118, 11)' : 'rgb(167, 170, 167)'
                  }}
                >
                  Add Me to Favorites! ★
                </button>
              </div>
            </div>
          ))}
        </div>


        <div style={{ marginTop: '16px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: '1px',
            margin: '30px 0'
          }}>
            <Button 
              onClick={goPrev} 
              disabled={!prevQuery}
              className="pagination-button"
              style={{ 
                borderRadius: '18px 0 0 18px',
                margin: '0',
                marginLeft: '10px'
              }}
            >
              Previous
            </Button>
            <Button 
              onClick={goNext} 
              disabled={!nextQuery || from + 25 >= totalResults}
              className="pagination-button"
              style={{ 
                borderRadius: '0 18px 18px 0',
                margin: '0',
                marginLeft: '10px'
              }}
            >
              Next
            </Button>
          </div>
          <div style={{ 
            textAlign: 'right',
            padding: '0 60px',
            color: '#666',
            fontSize: '14px',
            marginTop: '-20px'
          }}>
            Page {Math.floor(from / 25) + 1} of {Math.max(1, Math.ceil(totalResults / 25))}
          </div>
        </div>
    </div>
  );
}
