import type { HttpContext } from '@adonisjs/core/http'
import Stock from '#models/stock'

import csv from 'csv-parser'
import Workbook from 'exceljs'
import fs from 'node:fs'

export default class CsvsController {
  async create({ request, response }: HttpContext) {
    try {
      const file = request.file('file')

      if (!file) {
        return response.badRequest({ error: 'File not found' })
      }

      if (file.tmpPath) {
        fs.createReadStream(file.tmpPath)
          .pipe(csv())
          .on('data', async (row) => {
            console.log(row)
            await Stock.create(row)
          })
          .on('end', () => {
            console.log('CSV file successfully processed')
          })
      } else {
        return response.internalServerError({ error: 'File path not found' })
      }

      return response.created({ message: 'File uploaded successfully' })
    } catch (error) {
      return response.internalServerError({ error: 'Something went wrong' })
    }
  }
  async download({ request, response }: HttpContext) {
    try {
      const data = await Stock.query().select('variant', 'id', 'stock')

      if (!data) {
        response.notFound({ error: 'Data not found' })
      }

      const workbook = new Workbook.Workbook()
      const worksheet = workbook.addWorksheet('Stock Data')

      worksheet.addRow(['sku', 'stock_ids'])

      const groupedData = {}

      data.forEach(({ variant, id }) => {
        if (!Object.keys(groupedData).includes(variant)) {
          groupedData[variant] = []
        }
        groupedData[variant].push(id)
      })

      const finalData = Object.entries(groupedData).map(([sku, stock_ids]) => {
        return { sku, stock_ids: stock_ids.join('|') }
      })

      finalData.forEach((row) => {
        worksheet.addRow([row.sku, row.stock_ids])
      })

      const buffer = await workbook.xlsx.writeBuffer()

      response.header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      response.header('Content-Disposition', 'attachment; filename=stock.xlsx')
      response.send(buffer)
    } catch (error) {
      response.internalServerError({ error: 'Something went wrong' })
    }
  }
}
