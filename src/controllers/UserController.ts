import { Request, Response } from 'express'

import User from '../mocks/User'

interface user {
  id: number;
  nome: string;
  email: string
  telefone: string
  genero: string
  cpf: string
}

class UserController {
  public async getUsers (req: Request, res: Response): Promise<Response> {
    const users = User
    return res.json(users)
  }
}

export default new UserController()
