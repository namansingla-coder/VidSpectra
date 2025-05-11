import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import env from '#start/env'
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

      const fileName = `${Date.now()}_${pdfFile.clientName}`
      const uploadPath = path.join(app.makePath('public'), 'uploads')

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true })
      }

      await pdfFile.move(uploadPath, { name: fileName, overwrite: true })
      const fullFilePath = path.join(uploadPath, fileName)

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

  public async analyzeYoutube({ request, response }: HttpContext) {
    try {
      const videoId = request.input('video_id')
      if (!videoId) {
        return response.badRequest({ message: 'Video ID is required' })
      }

      const apiKey = env.get('YOUTUBE_API_KEY')

      const ytResponse = await axios.get('https://www.googleapis.com/youtube/v3/commentThreads', {
        params: {
          part: 'snippet',
          videoId,
          maxResults: 100,
          textFormat: 'plainText',
          key: apiKey,
        },
      })

      const comments = ytResponse.data.items.map(
        (item: any) => item.snippet.topLevelComment.snippet.textDisplay
      )

      if (comments.length === 0) {
        return response.ok({ message: 'No comments found', result: {} })
      }

      const rawText = comments.join('\n')

      const nlpResponse = await axios.post('http://127.0.0.1:8000/analyze-text', {
        raw_text: rawText,
      })

      return response.ok({
        message: 'YouTube comments analyzed successfully',
        result: nlpResponse.data,
      })
    } catch (error) {
      console.error('YouTube NLP Error:', error.message)
      return response.internalServerError({
        message: 'Failed to analyze YouTube comments',
        error: error.message,
      })
    }
  }
}