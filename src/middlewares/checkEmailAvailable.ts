import { Request, Response, NextFunction } from 'express'
import User from '../database/schemas/User'

export default async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    next()
  } else {
    return res.status(400).send({ error: 'Usuário já cadastrado' })
  }
}