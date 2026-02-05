export interface StatusEntry {
  code: string | number
  description: string
}

export interface MappingResult {
  id_carrier: string
  original: string
  id: string
  status: string
  pq: string
}
