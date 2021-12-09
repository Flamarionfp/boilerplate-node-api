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

// No auth
routes.post('/user', UserController.createUser)
routes.post('/auth', UserController.authUser)

// Require auth
routes.get('/users', authMiddleware, UserController.getUsers)
routes.get('/user/find/id/:id', authMiddleware, UserController.getUserById)
routes.get('/user/find/email/:email', authMiddleware, UserController.getUserByEmail)


export default routes
