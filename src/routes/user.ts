import { Router } from 'express'

// Middlewares
import checkEmailAvailable from '../middlewares/checkEmailAvailable'
import authMiddleware from '../middlewares/auth'

// Controllers
import UserController from '../controllers/UserController'

const userRoutes = Router()

// Endpoints
userRoutes.post('/user', checkEmailAvailable, UserController.createUser)
userRoutes.post('/auth', UserController.authUser)
userRoutes.get('/users', authMiddleware, UserController.getUsers)
userRoutes.get('/user/find/id/:id', authMiddleware, UserController.getUserById)
userRoutes.get('/user/find/email/:email', authMiddleware, UserController.getUserByEmail)
userRoutes.put('/user/update/:id', authMiddleware, UserController.updateUser)
userRoutes.put('/user/remove/:id', authMiddleware, UserController.removeUser)
userRoutes.delete('/user/delete/:id', authMiddleware, UserController.deleteUser)
userRoutes.patch('/user/changepassword/:id', authMiddleware, UserController.changePassword)
userRoutes.post('/user/forgot_password', UserController.forgotPassword)
userRoutes.patch('/user/reset_password', UserController.resetPassword)

export default userRoutes
