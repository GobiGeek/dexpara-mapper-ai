import { MappingResult } from '../../core/types/Status.js'

export interface IAIProvider {
  mapStatusBatch(inputs: string[], context: string): Promise<MappingResult[]>
}
