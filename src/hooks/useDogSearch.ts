import { useState, useEffect } from 'react';
import type { Dog } from '../types';
import { fetchBreeds, searchDogs, fetchDogsByIds } from '../api/dogService';

type SortOrder = 'asc' | 'desc' | 'nameAsc' | 'nameDesc' | 'ageAsc' | 'ageDesc';

interface UseDogSearchReturn {
  breeds: string[];
  selectedBreeds: { value: string; label: string }[];
  setSelectedBreeds: (breeds: { value: string; label: string }[]) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  dogs: Dog[];
  totalResults: number;
  from: number;
  nextQuery: string | null;
  prevQuery: string | null;
  ageRange: [number, number];
  setAgeRange: (range: [number, number]) => void;
  zipCodes: string;
  setZipCodes: (value: string) => void;
  goNext: () => void;
  goPrev: () => void;
  isLoading: boolean;
  isGeneratingMatch: boolean;
  error: string | null;
}

function isValidZipCode(zip: string): boolean {
  // Remove any non-digit characters and check length
  const digits = zip.replace(/\D/g, '');
  return digits.length >= 5;
}

function parseZipCodes(input: string): string[] {
  // Split by comma+space or just space
  return input.split(/,\s*|\s+/)
    .map(zip => zip.trim())
    .filter(zip => zip.length > 0);
}

function hasValidZipCodes(zipCodes: string): boolean {
  const codes = parseZipCodes(zipCodes);
  return codes.length > 0 && codes.every(isValidZipCode);
}

export function useDogSearch(): UseDogSearchReturn {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<{ value: string; label: string }[]>(() => {
    const saved = localStorage.getItem('selectedBreeds');
    return saved ? JSON.parse(saved) : [];
  });
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [dogIds, setDogIds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [from, setFrom] = useState(0);
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
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingMatch, setIsGeneratingMatch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedAgeRange, setDebouncedAgeRange] = useState<[number, number]>(ageRange);
  const [debouncedZipCodes, setDebouncedZipCodes] = useState<string>(zipCodes);
  const [lastValidZipCodes, setLastValidZipCodes] = useState<string>(zipCodes);

  // Fetch breeds on mount
  useEffect(() => {
    const loadBreeds = async () => {
      try {
        const data = await fetchBreeds();
        setBreeds(data);
      } catch (err) {
        setError('Failed to fetch breeds');
      }
    };
    loadBreeds();
  }, []);

  // Save selected breeds to localStorage
  useEffect(() => {
    localStorage.setItem('selectedBreeds', JSON.stringify(selectedBreeds));
  }, [selectedBreeds]);

  // Save age range to localStorage
  useEffect(() => {
    localStorage.setItem('ageRange', JSON.stringify(ageRange));
  }, [ageRange]);

  // Save zip codes to localStorage
  useEffect(() => {
    localStorage.setItem('zipCodes', zipCodes);
  }, [zipCodes]);

  // Debounce age range changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAgeRange(ageRange);
    }, 500);

    return () => clearTimeout(timer);
  }, [ageRange]);

  // Handle zip code changes and validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasValidZipCodes(zipCodes)) {
        setDebouncedZipCodes(zipCodes);
        setLastValidZipCodes(zipCodes);
      } else if (zipCodes === '') {
        // If zip codes is empty, clear the results
        setDebouncedZipCodes('');
        setLastValidZipCodes('');
      } else {
        // If invalid, keep using the last valid zip codes
        setDebouncedZipCodes(lastValidZipCodes);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [zipCodes, lastValidZipCodes]);

  // Fetch dog IDs based on search criteria
  useEffect(() => {
    const fetchDogIds = async () => {
      try {
        const sortParam = getSortParam(sortOrder);
        const zipArray = parseZipCodes(debouncedZipCodes);
        
        const data = await searchDogs({
          breeds: selectedBreeds.map(b => b.value),
          zipCodes: zipArray,
          ageMin: debouncedAgeRange[0],
          ageMax: debouncedAgeRange[1],
          size: 25,
          from,
          sort: sortParam
        });

        setDogIds(data.resultIds);
        setTotalResults(data.total);
        setNextQuery(data.next ?? null);
        setPrevQuery(data.prev ?? null);
      } catch (err) {
        setError('Failed to search dogs');
      }
    };

    fetchDogIds();
  }, [selectedBreeds, sortOrder, from, debouncedAgeRange, debouncedZipCodes]);

  // Fetch dog details when IDs change
  useEffect(() => {
    const fetchDogs = async () => {
      if (dogIds.length === 0) {
        setDogs([]);
        return;
      }

      try {
        const data = await fetchDogsByIds(dogIds);
        // Reorder dogs to match dogIds order
        const dogMap = new Map(data.map(dog => [dog.id, dog]));
        const orderedDogs = dogIds.map(id => dogMap.get(id)).filter(Boolean) as Dog[];
        setDogs(orderedDogs);
      } catch (err) {
        setError('Failed to fetch dog details');
      }
    };

    fetchDogs();
  }, [dogIds]);

  // Pagination handlers
  const goNext = () => {
    if (nextQuery) {
      const urlParams = new URLSearchParams(nextQuery);
      setFrom(Number(urlParams.get('from') ?? 0));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goPrev = () => {
    if (prevQuery) {
      const urlParams = new URLSearchParams(prevQuery);
      setFrom(Number(urlParams.get('from') ?? 0));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
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
    isLoading,
    isGeneratingMatch,
    error
  };
}

function getSortParam(sortOrder: SortOrder): string {
  switch (sortOrder) {
    case 'asc':
      return 'breed:asc';
    case 'desc':
      return 'breed:desc';
    case 'nameAsc':
      return 'name:asc';
    case 'nameDesc':
      return 'name:desc';
    case 'ageAsc':
      return 'age:asc';
    case 'ageDesc':
      return 'age:desc';
  }
} 