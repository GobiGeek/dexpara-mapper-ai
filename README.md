# AI DexPara TMS

Projeto desenvolvido para automatizar a **parametrização de DexPara entre transportadoras e sistemas TMS**, utilizando **Inteligência Artificial**.

A aplicação recebe ocorrências logísticas em formato **JSON**, interpreta os dados com apoio de IA e devolve um **arquivo Excel** contendo:

- A parametrização DexPara sugerida
- A lógica utilizada para cada mapeamento

## 🚚 Problema que o projeto resolve

Cada transportadora possui códigos e descrições próprias para ocorrências logísticas, enquanto o TMS trabalha com um padrão diferente.  
Esse desalinhamento gera:

- Trabalho manual excessivo
- Erros de interpretação
- Dificuldade de manutenção das regras

Este projeto automatiza esse processo de forma inteligente.

## 🧠 Como funciona

1. O sistema recebe um **JSON** com as ocorrências da transportadora
2. A IA analisa códigos, descrições e contexto
3. É realizado o **DexPara automático** com base em similaridade semântica
4. O resultado é exportado para um **arquivo Excel (.xlsx)** contendo:
   - Código da transportadora
   - Descrição original
   - Código TMS sugerido
   - Descrição TMS
   - **Lógica utilizada pela IA** (explicação do mapeamento)

## 📂 Entrada (exemplo simplificado)

```json
[
  {
    "code": "729",
    "description": "Refazer a acareação"
  },
  {
    "code": "1",
    "description": "Arquivo processado"
  }
]
```
