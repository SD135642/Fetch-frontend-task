import Select from 'react-select';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface SearchFiltersProps {
  breeds: string[];
  selectedBreeds: { value: string; label: string }[];
  onBreedChange: (selected: any) => void;
  ageRange: [number, number];
  onAgeRangeChange: (range: number | number[]) => void;
  zipCodes: string;
  onZipCodesChange: (value: string) => void;
  sortOrder: 'asc' | 'desc' | 'nameAsc' | 'nameDesc' | 'ageAsc' | 'ageDesc';
  onSortOrderChange: (value: 'asc' | 'desc' | 'nameAsc' | 'nameDesc' | 'ageAsc' | 'ageDesc') => void;
}

export default function SearchFilters({
  breeds,
  selectedBreeds,
  onBreedChange,
  ageRange,
  onAgeRangeChange,
  zipCodes,
  onZipCodesChange,
  sortOrder,
  onSortOrderChange,
}: SearchFiltersProps) {
  const breedOptions = breeds.map(breed => ({ value: breed, label: breed }));

  return (
    <div className="search-wrapper" style={{ 
      position: 'relative', 
      width: '1100px', 
      height: '300px',
      margin: '0 auto',
      marginTop: '20px'
    }}>
      <div className="white-box-search" style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
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
        <div className="adopt-header" style={{ marginBottom: 70, marginTop: 20, marginLeft: 25 }}>
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
              onChange={onBreedChange}
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
              onChange={onAgeRangeChange}
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
              onChange={e => onZipCodesChange(e.target.value)}
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
            onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc' | 'nameAsc' | 'nameDesc' | 'ageAsc' | 'ageDesc')}
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
  );
} 