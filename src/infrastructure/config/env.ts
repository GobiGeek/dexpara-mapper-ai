import 'dotenv/config'

const getEnvVar = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(
      `Falha de configuração: A variável de ambiente ${key} não foi definida.`,
    )
  }
  return value
}

export const env = {
  GEMINI_KEY: getEnvVar('GEMINI_API_KEY'),
}
