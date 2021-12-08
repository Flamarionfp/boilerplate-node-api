import { Request, Response } from 'express'

import User from '../database/schemas/User'
import hashPassword from '../utils/hashPassword'
class UserController {
  public async getUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.find()
      return res.status(200).json(users)
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }

  public async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const passwordHashed = await hashPassword(req.body.password)
      const user = await User.create({ ...req.body, password: passwordHashed })
      return res.status(200).json(user)
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }
}

export default new UserController()
