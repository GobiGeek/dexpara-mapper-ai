import ExcelJS from 'exceljs'
import { MappingResult } from '../../core/types/Status'

export class ExcelProvider {
  async generate(data: MappingResult[], filePath: string): Promise<void> {
    const workbook = new ExcelJS.Workbook()

    const sheet = workbook.addWorksheet('De-Para')

    sheet.columns = [
      { header: 'Status Original', key: 'original', width: 45 },
      { header: 'ID TMS', key: 'id', width: 15 },
      { header: 'Descrição TMS', key: 'status', width: 45 },
      { header: 'Raciocínio IA', key: 'pq', width: 50 },
    ]

    sheet.addRows(data)

    sheet.getRow(1).font = { bold: true }
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    }

    await workbook.xlsx.writeFile(filePath)
  }
}
