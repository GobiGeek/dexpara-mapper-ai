export interface IExcelGenerator {
  generate(data: any[], fileName: string): Promise<void>
}
