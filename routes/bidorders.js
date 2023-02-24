import { Router } from 'express'
import { jwt } from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import { createBIDOrder, getMyBIDOrders, getAllBIDOrders } from '../controllers/bidorders.js'

const router = Router()

router.post('/', jwt, createBIDOrder)
router.get('/', jwt, getMyBIDOrders)
router.get('/all', jwt, admin, getAllBIDOrders)

export default router
