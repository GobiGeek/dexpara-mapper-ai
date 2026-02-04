export interface StatusEntry {
  code: string | number
  description: string
}

export interface MappingResult {
  original: string
  id: string
  status: string
  pq: string
}
