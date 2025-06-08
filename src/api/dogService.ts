import type { Dog } from '../types';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

export async function fetchBreeds(): Promise<string[]> {
  const res = await fetch(`${API_BASE_URL}/dogs/breeds`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch breeds');
  }

  return res.json();
}

interface SearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: string;
}

interface SearchResponse {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

export async function searchDogs(params: SearchParams): Promise<SearchResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.breeds?.length) {
    params.breeds.forEach(breed => searchParams.append('breeds', breed));
  }
  
  if (params.zipCodes?.length) {
    params.zipCodes.forEach(zip => searchParams.append('zipCodes', zip));
  }
  
  if (params.ageMin !== undefined) {
    searchParams.append('ageMin', params.ageMin.toString());
  }
  
  if (params.ageMax !== undefined) {
    searchParams.append('ageMax', params.ageMax.toString());
  }
  
  if (params.size !== undefined) {
    searchParams.append('size', params.size.toString());
  }
  
  if (params.from !== undefined) {
    searchParams.append('from', params.from.toString());
  }
  
  if (params.sort) {
    searchParams.append('sort', params.sort);
  }

  const res = await fetch(`${API_BASE_URL}/dogs/search?${searchParams.toString()}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to search dogs');
  }

  return res.json();
}

export async function fetchDogsByIds(dogIds: string[]): Promise<Dog[]> {
  const res = await fetch(`${API_BASE_URL}/dogs`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dogIds),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch dog details');
  }

  return res.json();
} 