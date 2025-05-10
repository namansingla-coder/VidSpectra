import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

export default class PdfController {
  public async upload({ request, response }: HttpContext) {
    try {
      const pdfFile = request.file('file', {
        extnames: ['pdf'],
        size: '5mb',
      })

      if (!pdfFile) {
        return response.badRequest({ message: 'PDF file is required' })
      }

      const fileName = `${new Date().getTime()}_${pdfFile.clientName}`
      const uploadPath = path.join(app.makePath('public'), 'uploads')

      // Ensure the uploads folder exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true })
      }

      // Move file to disk
      await pdfFile.move(uploadPath, {
        name: fileName,
        overwrite: true,
      })

      const fullFilePath = path.join(uploadPath, fileName)
      console.log('PDF saved at:', fullFilePath)

      // Call FastAPI NLP microservice
      const nlpResponse = await axios.post('http://127.0.0.1:8000/analyze', {
        file_path: fullFilePath,
      })

      return response.ok({
        message: 'PDF analyzed successfully',
        result: nlpResponse.data,
      })
    } catch (error) {
      console.error('NLP Error:', error.message)
      return response.internalServerError({
        message: 'Failed to analyze PDF',
        error: error.message,
      })
    }
  }
}