import { useDogSearch } from '../hooks/useDogSearch';
import { useFavorites } from '../hooks/useFavorites';
import SearchFilters from '../components/SearchFilters';
import DogCard from '../components/DogCard';
import Pagination from '../components/Pagination';
import FavoritesCart from '../components/FavoritesCart';
import LoadingSpinner from '../components/LoadingSpinner';
import LogoutButton from '../components/LogoutButton';

export default function SearchPage() {
  const {
    breeds,
    selectedBreeds,
    setSelectedBreeds,
    sortOrder,
    setSortOrder,
    dogs,
    totalResults,
    from,
    nextQuery,
    prevQuery,
    ageRange,
    setAgeRange,
    zipCodes,
    setZipCodes,
    goNext,
    goPrev,
    isGeneratingMatch,
    error
  } = useDogSearch();

  const {
    favorites,
    previousMatches,
    toggleFavorite,
    removeFavorite,
    clearAll,
    isFavorite,
    addMatch,
    clearMatches
  } = useFavorites();

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</div>;
  }

  return (
    <div>
      <LogoutButton />
      <FavoritesCart 
        favorites={favorites} 
        previousMatches={previousMatches}
        onRemoveFavorite={removeFavorite}
        onClearAll={clearAll}
        onClearMatches={clearMatches}
        onAddMatch={addMatch}
      />
      
      <SearchFilters
        breeds={breeds}
        selectedBreeds={selectedBreeds}
        onBreedChange={setSelectedBreeds}
        ageRange={ageRange}
        onAgeRangeChange={range => Array.isArray(range) && setAgeRange([range[0], range[1]])}
        zipCodes={zipCodes}
        onZipCodesChange={setZipCodes}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      <div style={{ 
        width: '1100px',
        margin: '0 auto',
        padding: '0 60px',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          marginTop: '20px', 
          marginBottom: '5px',
          textAlign: 'left',
        }}>
          Total Results: {totalResults}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '40px',
            padding: '10px 0',
            minHeight: '100px',
            position: 'relative'
          }}
        >
          {isGeneratingMatch && (
            <div style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 1
            }}>
              <LoadingSpinner />
            </div>
          )}
          
          {dogs.length === 0 ? (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '50px',
              color: '#666'
            }}>
              No dogs found matching your criteria
            </div>
          ) : (
            dogs.map(dog => (
              <DogCard
                key={dog.id}
                dog={dog}
                isFavorite={isFavorite(dog.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))
          )}
        </div>
      </div>

      <Pagination
        onPrev={goPrev}
        onNext={goNext}
        hasPrev={!!prevQuery}
        hasNext={!!nextQuery}
        currentPage={Math.floor(from / 25) + 1}
        totalPages={Math.max(1, Math.ceil(totalResults / 25))}
        from={from}
        totalResults={totalResults}
      />
    </div>
  );
} 