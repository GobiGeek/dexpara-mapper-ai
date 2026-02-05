import { IAIProvider } from '../interfaces/IAIProvider.js'
import { StatusEntry, MappingResult } from '../../core/types/Status.js'

export class MapCarrierStatusUseCase {
  constructor(private aiProvider: IAIProvider) {}

  async execute(
    carrierData: StatusEntry[],
    tmsData: StatusEntry[],
  ): Promise<MappingResult[]> {
    const tmsContext = tmsData
      .map((t) => `ID:${t.code}|DESC:${t.description}`)
      .join('\n')

    const inputs = carrierData.map(
      (c) => `ID_CARRIER:${c.code}|DESC:${c.description}`,
    )

    return await this.aiProvider.mapStatusBatch(inputs, tmsContext)
  }
}
