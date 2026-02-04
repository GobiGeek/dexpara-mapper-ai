import { GoogleGenerativeAI } from '@google/generative-ai'
import { IAIProvider } from '../../application/interfaces/IAIProvider.js'
import { MappingResult } from '../../core/types/Status.js'
import { settings } from '../config/settings.js'

export class GeminiProvider implements IAIProvider {
  private model: any

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey)
    this.model = genAI.getGenerativeModel({
      model: settings.ai.modelName, // Config centralizada
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: settings.ai.temperature,
      },
    })
  }

  async mapStatusBatch(
    inputs: string[],
    context: string,
  ): Promise<MappingResult[]> {
    const prompt = `Dicionário TMS:\n${context}\n\nItens:\n- ${inputs.join('\n- ')}\n\nRetorne Array JSON.`
    const result = await this.model.generateContent(prompt)
    return JSON.parse(result.response.text())
  }
}
