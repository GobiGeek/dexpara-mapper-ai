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

    const prompt = `Você é um motor de tradução logística de alta precisão. Sua missão é realizar o mapeamento De-Para entre ocorrências de transportadoras e o dicionário oficial TMS.

### REGRAS CRÍTICAS DE NEGÓCIO:
1. **Rigor de Similaridade:** Se o status da transportadora não tiver uma correlação clara e direta com nenhum item do dicionário TMS, você deve retornar "id": null, "status": null e "pq": "Baixa similaridade semântica". NÃO TENTE FORÇAR UM VÍNCULO.
2. **Prioridade de Evento:** - Status que indicam o início da jornada (ex: "Transporte iniciado", "Coleta realizada", "Postado") devem ser mapeados para "Coletado/Postado" e não para "Em trânsito". 
   - "Em trânsito" deve ser usado apenas para movimentações entre unidades ou quando a mercadoria já saiu da origem mas ainda não chegou ao destino final.
3. **Casos Vazios:** Se a descrição for ambígua demais (ex: "...", "Status 123", "Processando"), retorne nulo.

### DICIONÁRIO TMS (REFERÊNCIA ÚNICA):
${context}

### LISTA PARA TRADUZIR (ITENS DA TRANSPORTADORA):
${totalItens} itens:

### FORMATO DE SAÍDA:
Retorne EXCLUSIVAMENTE um array JSON com exatamente ${totalItens} objetos, respeitando a ordem da lista.
Estrutura:
[
  {
    "id_carrier": "ID da transportadora - carrier_geral",
    "original": "texto_original", 
    "id_trans": "id_vindo_da_lista", 
    "id": "ID_TMS_OU_NULL", 
    "status": "DESC_TMS_OU_NULL", 
    "pq": "Explicação curta do motivo técnica ou motivo da rejeição"
  }
]
    
    Você é um motor de tradução logística.
    
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

      if (!Array.isArray(parsed)) throw new Error('IA não retornou um array')

      return parsed
    } catch (error) {
      console.error(`Erro no Gemini ao processar ${totalItens} itens.`)
      throw error
    }
  }
}
