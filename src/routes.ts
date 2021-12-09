import { Router } from 'express'

// Middleware
import authMiddleware from '../src/middlewares/authMiddleware'

// Controllers
import UserController from './controllers/UserController'

const routes = Router()

routes.get('/', (req, res) => {
  res.send('olá')
})

// User endpoints

routes.get('/users', authMiddleware, UserController.getUsers)
routes.post('/user', UserController.createUser)
routes.post('/auth', UserController.authUser)

export default routes
