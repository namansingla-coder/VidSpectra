/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import PdfController from '#controllers/pdfs_controller'
router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router.post('/upload',[PdfController,'upload'])
