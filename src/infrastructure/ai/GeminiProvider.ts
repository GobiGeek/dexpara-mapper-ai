import { GoogleGenerativeAI } from '@google/generative-ai'
import { IAIProvider } from '../../application/interfaces/IAIProvider.js'
import { MappingResult } from '../../core/types/Status.js'
import { settings } from '../config/settings.js'

export class GeminiProvider implements IAIProvider {
  private model: any

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey)
    this.model = genAI.getGenerativeModel({
      model: settings.ai.modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: settings.ai.temperature,
      },
    })
  }

  // Recebe string[] (Array)
  async mapStatusBatch(
    inputs: string[],
    context: string,
  ): Promise<MappingResult[]> {
    const totalItens = inputs.length

    if (totalItens === 0) return []

    console.log(`Enviando prompt com ${totalItens} itens para o Gemini...`)

    const inputsText = inputs.join('\n')

    const prompt = `Você é um motor de tradução logística.
    
    CONTEXTO:
    Recebi uma lista com exatos ${totalItens} itens.
    Sua missão é devolver um JSON contendo exatos ${totalItens} objetos.

    DICIONÁRIO TMS:
    ${context}

    ITENS PARA ANALISAR:
    ${inputsText}

    Retorne JSON Array de objetos:
    [
      { "id_carrier": "...", "original": "...", "id": "...", "status": "...", "pq": "..." }
    ]`

    try {
      const result = await this.model.generateContent(prompt)
      const responseText = result.response.text()
      const cleanJson = responseText.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(cleanJson)

      // Validação extra de segurança
      if (!Array.isArray(parsed)) throw new Error('IA não retornou um array')

      return parsed
    } catch (error) {
      console.error(`Erro no Gemini ao processar ${totalItens} itens.`)
      throw error
    }
  }
}
