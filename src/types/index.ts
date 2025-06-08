export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface SearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: string;
}

export interface SearchResponse {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

export type SortOrder = 'asc' | 'desc' | 'nameAsc' | 'nameDesc' | 'ageAsc' | 'ageDesc'; 