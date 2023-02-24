import { Router } from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import { register, login, logout, extend, getUser, editCart, getCart, editbidcart, getbidcart } from '../controllers/users.js'

const router = Router()

router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.patch('/extend', auth.jwt, extend)
router.get('/me', auth.jwt, getUser)
router.post('/cart', content('application/json'), auth.jwt, editCart)
router.post('/bidcart', content('application/json'), auth.jwt, editbidcart)
router.get('/cart', auth.jwt, getCart)
router.get('/bidcart', auth.jwt, getbidcart)

export default router
