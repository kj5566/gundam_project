import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import { jwt } from '../middleware/auth.js'
import { createbiddings, getAllbiddings, getbiddings, getSellbiddings, editbiddings } from '../controllers/biddings.js'

const router = Router()

router.post('/', content('multipart/form-data'), jwt, admin, upload, createbiddings)
router.get('/', getSellbiddings)
router.get('/', getAllbiddings)
router.get('/all', getAllbiddings)
router.get('/:id', getbiddings)
router.patch('/:id', content('multipart/form-data'), jwt, admin, upload, editbiddings)

export default router
