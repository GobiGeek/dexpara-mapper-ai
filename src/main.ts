import fs from 'fs'
import path from 'path'
import { env } from './infrastructure/config/env.js'
import { settings } from './infrastructure/config/settings.js'
import { GeminiProvider } from './infrastructure/ai/GeminiProvider.js'
import { ExcelProvider } from './infrastructure/storage/ExcelProvider.js'
import { MapCarrierStatusUseCase } from './application/use-cases/MapCarrierStatusUseCase.js'

async function bootstrap() {
  try {
    console.log('🚀 Inicializando sistema...')

    // Injeção de Dependências
    const aiProvider = new GeminiProvider(env.GEMINI_KEY)
    const excelProvider = new ExcelProvider()
    const useCase = new MapCarrierStatusUseCase(aiProvider)

    // Definição de Caminhos
    const tmsPath = path.join(settings.paths.inputs, settings.paths.tmsJson)
    const carrierPath = path.join(
      settings.paths.inputs,
      settings.paths.carrierJson,
    )

    // Execução
    console.log(`Lendo arquivos de: ${settings.paths.inputs}`)
    const tmsData = JSON.parse(fs.readFileSync(tmsPath, 'utf-8'))
    const carrierData = JSON.parse(fs.readFileSync(carrierPath, 'utf-8'))

    console.log('Processando...')
    const results = await useCase.execute(carrierData, tmsData)

    console.log(`Salvando planilha...`)
    await excelProvider.generate(results, settings.paths.outputFile)

    console.log(`Finalizado! Arquivo em: ${settings.paths.outputFile}`)
  } catch (error: any) {
    console.error('Erro fatal:', error.message)
    process.exit(1)
  }
}

bootstrap()
