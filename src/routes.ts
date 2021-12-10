import { Router } from 'express'

// Middlewares
import checkEmailAvailable from './middlewares/checkEmailAvailable'
import authMiddleware from '../src/middlewares/auth'

// Controllers
import UserController from './controllers/UserController'

const routes = Router()

routes.get('/', (req, res) => {
  res.redirect('https://github.com/Flamarionfp/standard-api')
})

// User endpoints

// No auth
routes.post('/user', checkEmailAvailable, UserController.createUser)
routes.post('/auth', UserController.authUser)

// Require auth
routes.get('/users', authMiddleware, UserController.getUsers)
routes.get('/user/find/id/:id', authMiddleware, UserController.getUserById)
routes.get('/user/find/email/:email', authMiddleware, UserController.getUserByEmail)
routes.put('/user/update/:id', authMiddleware, UserController.updateUser)


export default routes
