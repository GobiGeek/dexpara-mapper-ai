import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..', '..', '..')

export const settings = {
  paths: {
    root: projectRoot,
    inputs: path.join(projectRoot, 'inputs'),
    outputFile: path.join(projectRoot, 'Resultado_Clean_Arch.xlsx'),
    tmsJson: 'tms_status.json',
    carrierJson: 'carrier_geral.json',
  },
  ai: {
    modelName: 'models/gemini-3-flash-preview',
    temperature: 0.1,
    maxOutputTokens: 8192,
  },
}
