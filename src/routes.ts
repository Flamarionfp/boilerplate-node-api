import { Router } from 'express'

import UserController from './controllers/UserController'

const routes = Router()

routes.get('/', (req, res) => {
  res.send('olá')
})

// User endpoints

routes.get('/users', UserController.getUsers)
routes.post('/user', UserController.createUser)

export default routes
