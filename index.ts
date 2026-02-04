import 'dotenv/config'
import ExcelJS from 'exceljs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { GoogleGenerativeAI } from '@google/generative-ai'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const INPUT_DIR = path.join(__dirname, 'inputs')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Utilizando o Gemini 3 Flash, seu modelo principal do Paid Tier
const model = genAI.getGenerativeModel({
  model: 'models/gemini-3-flash-preview',
  generationConfig: {
    responseMimeType: 'application/json',
    temperature: 0.1, // Baixa temperatura para garantir fidelidade técnica
  },
})

async function processarTudoDeUmaVez() {
  try {
    // Lendo os arquivos de entrada
    const tmsData = JSON.parse(
      fs.readFileSync(path.join(INPUT_DIR, 'tms_status.json'), 'utf-8'),
    )
    const carrierData = JSON.parse(
      fs.readFileSync(path.join(INPUT_DIR, 'carrier_geral.json'), 'utf-8'),
    )

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('De-Para Final')
    sheet.columns = [
      { header: 'Código Transportadora', key: 'ext_cod', width: 15 },
      { header: 'Status Original (Transportadora)', key: 'ext', width: 45 },
      { header: 'Código TMS', key: 'tms_cod', width: 15 },
      { header: 'Status TMS Sugerido', key: 'tms_desc', width: 45 },
      { header: 'Raciocínio Semântico', key: 'reason', width: 45 },
    ]

    // Preparando o contexto
    const tmsContexto = tmsData
      .map((t: any) => `ID:${t.code}|DESC:${t.description}`)
      .join('\n')
    const listaParaTraduzir = carrierData
      .map((c: any, index: number) => `${index + 1}. ${c.description}`)
      .join('\n')

    const prompt = `Você é um motor de tradução logística de alto desempenho. 
        Abaixo está meu dicionário oficial (TMS) e uma lista de 269 ocorrências de transportadora.
        
        Sua tarefa: Mapear CADA UM dos 269 itens para o ID mais adequado no dicionário por SIMILARIDADE SEMÂNTICA.
        
        DICIONÁRIO TMS:
        ${tmsContexto}

        LISTA PARA TRADUZIR:
        ${listaParaTraduzir}

        Retorne EXCLUSIVAMENTE um array JSON com exatamente 269 objetos:
        [
          {"original": "texto_original", "id_trans": "id_trans", "id": "id_tms", "status": "desc_tms", "pq": "motivo"}
        ]`

    console.log(
      `🚀 Enviando requisição única para o Gemini 3 Flash (269 itens)...`,
    )

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    // Sanitização básica caso a IA coloque blocos de markdown
    const cleanJson = responseText.replace(/```json|```/g, '').trim()
    const response = JSON.parse(cleanJson)

    console.log(
      `✅ Sucesso! Recebidos ${response.length} mapeamentos. Gerando Excel...`,
    )

    response.forEach((item: any) => {
      sheet.addRow({
        ext_cod: item.id_trans,
        ext: item.original,
        tms_cod: item.id,
        tms_desc: item.status,
        reason: item.pq,
      })
    })

    const outputName = `DE_PARA_FINAL_RESULTADO.xlsx`
    await workbook.xlsx.writeFile(outputName)

    console.log(`\n-----------------------------------------`)
    console.log(`🏆 PROCESSO CONCLUÍDO COM SUCESSO!`)
    console.log(`📁 Arquivo gerado: ${outputName}`)
    console.log(`-----------------------------------------\n`)
  } catch (error: any) {
    console.error('❌ Erro durante o processamento:', error.message)
    if (error.message.includes('503')) {
      console.log(
        '💡 Dica: O servidor está instável. Tente novamente em alguns minutos.',
      )
    }
  }
}

processarTudoDeUmaVez()
