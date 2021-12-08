import { Request, Response } from 'express'

import User from '../database/schemas/User'
import hashPassword from '../utils/hashPassword'
class UserController {
  public async getUsers(req: Request, res: Response): Promise<Response> {
    const users = await User.find()
    return res.json(users)
  }

  public async createUser(req: Request, res: Response): Promise<Response> {
    const passwordHashed = await hashPassword(req.body.password)
    const user = await User.create({ ...req.body, password: passwordHashed })
    console.log(user)
    console.log(passwordHashed)
    return res.json(user)
  }
}

export default new UserController()
