import { Router } from 'express'

import UserController from './controllers/UserController'

const routes = Router()

routes.get('/', (req, res) => {
  res.send('olá')
})

routes.get('/users', UserController.getUsers)

export default routes
