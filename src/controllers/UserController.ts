import { Request, Response } from 'express'
import User from '../database/schemas/User'
import hashPassword from '../utils/hashPassword/hashPassword'
import checkPassword from '../utils/hashPassword/checkPassword'
import generateToken from '../utils/generateToken'

class UserController {
  public async authUser(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body
    try {
      const user = await User.findOne({ email: email }).select('+password')
      console.log(user)
      if (!user) {
        return res.status(400).send({ error: 'Usuário não encontrado' })
      }

      // Retorna false se o password informado na requisição não bater com o criptografado
      if (!checkPassword(password, user.password)) {
        return res.status(400).send({ error: 'Senha inválida' })
      }

      user.password = ''

      return res.status(200).send({ user, token: generateToken({ id: user.id }) })

    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }

  public async getUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.find()
      return res.status(200).json(users)
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }

  public async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findById(req.params.id)
      return res.status(200).json(user)
    } catch (error) {
      return res.status(500).json({ error: 'Usuário não encontrado' })
    }
  }

  public async getUserByEmail(req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findOne({ email: req.params.email })
      if (user !== null) {
        return res.status(200).json(user)
      } else {
        return res.status(404).send({ error: 'Usuário não encontrado' })
      }
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }

  public async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const passwordHashed = await hashPassword(req.body.password)
      const user = await User.create({ ...req.body, password: passwordHashed })
      return res.status(200).send({ user, token: generateToken({ id: user.id }) })
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }

  public async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      if (id === req.userId) {
        const user = await User.findByIdAndUpdate(id, req.body)
        console.log(user)
        return res.status(200).send({ status: 'ok', user: user })
      } else {
        return res.status(401).send({ status: 'unauthorized', error: 'Você não pode atualizar os dados desse usuário' })
      }
    } catch (error) {
      return res.status(500).json({ error: 'Falha ao atualizar usuário' })
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { id } = req.params

      if (id === req.userId) {
        const user = await User.findByIdAndDelete(id)
        if (user) {
          return res.status(200).send({ msg: 'Usuário deletado com sucesso' })
        } else {
          return res.status(400).send({ error: 'Falha ao deletar usuário' })
        }
      } else {
        return res.status(400).send({ error: 'Você não pode deletar esse usuário' })
      }
    } catch (error) {
      return res.status(500).send({ msg: 'Ocorreu um erro por parte do servidor', error: error })
    }
  }
}

export default new UserController();
