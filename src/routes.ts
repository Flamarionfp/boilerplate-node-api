import { Router } from 'express'

// Middlewares
import authMiddleware from '../src/middlewares/authMiddleware'

// Controllers
import UserController from './controllers/UserController'

const routes = Router()

routes.get('/', (req, res) => {
  res.redirect('https://github.com/Flamarionfp/standard-api')
})

// User endpoints
routes.get('/users', authMiddleware, UserController.getUsers)
routes.get('/user/:id', authMiddleware, UserController.getUserById)
routes.post('/user', UserController.createUser)
routes.post('/auth', UserController.authUser)

export default routes
