import { Request, Response } from 'express'
import User from '../database/schemas/User'
import hashPassword from '../utils/hashPassword'
import checkPassword from '../utils/checkPassword'
import generateJwtToken from '../utils/generateJwtToken'
import generateToken from '../utils/generateToken'
import sendEmailForgotPassword from '../mail/sendEmailForgotPassword'
class UserController {
  public async authUser(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body
    try {
      const user = await User.findOne({ email: email, isActive: true }).select('+password')
      if (!user) {
        return res.status(400).send({ error: 'Usuário não encontrado' })
      }

      // Retorna false se o password informado na requisição não bater com o criptografado
      if (!checkPassword(password, user.password)) {
        return res.status(400).send({ error: 'Senha inválida' })
      }

      user.password = ''

      return res.status(200).send({ user, token: generateJwtToken({ id: user.id }) })

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
      const user = await User.create({ ...req.body, password: passwordHashed, isActive: true })
      return res.status(200).send({ user, token: generateJwtToken({ id: user.id }) })
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }

  public async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      if (id === req.userId) {
        const user = await User.findByIdAndUpdate(id, req.body)
        return res.status(200).send({ status: 'ok', user: user })
      } else {
        return res.status(401).send({ status: 'unauthorized', error: 'Você não pode atualizar os dados desse usuário' })
      }
    } catch (error) {
      return res.status(500).json({ error: 'Falha ao atualizar usuário' })
    }
  }

  // Deletar de forma lógica
  public async removeUser(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { id } = req.params

      if (id === req.userId) {
        const user = await User.findByIdAndUpdate(id, { isActive: false })
        return res.status(200).send({ msg: 'Usuário removido com sucesso!' })
      }
    } catch (error) {
      return res.status(500).send({ msg: 'Ocorreu um erro por parte do servidor', error: error })
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

  public async changePassword(req: Request, res: Response): Promise<Response | undefined | null> {
    try {
      const { password, newPassword } = req.body
      const { id } = req.params
      if (id === req.userId) {
        const user = await User.findOne({ id: id }).select('+password')
        const userPassword = user?.password

        if (userPassword) {
          const arePasswordsEqual = await checkPassword(password, userPassword)
          if (!arePasswordsEqual) {
            return res.status(400).send({ msg: 'Senha inválida' })
          } else {
            const hashedNewPassword = await hashPassword(newPassword)
            const areNewPasswordEqual = await checkPassword(newPassword, userPassword)
            if (!areNewPasswordEqual) {
              const updatedUser = await User.findByIdAndUpdate(id, { password: hashedNewPassword })
              if (updatedUser) {
                return res.status(200).send({ msg: 'Senha alterada com sucesso!' })
              } else {
                return res.status(400).send({ msg: 'Erro ao seguir com a requisição' })
              }
            } else {
              return res.status(400).send({ msg: 'A nova senha não pode ser igual a anterior' })
            }
          }
        } else {
          return res.status(400).send({ msg: 'Erro, usuário não encontrado' })
        }
      } else {
        return res.status(401).send({ msg: 'Você não pode alterar a senha desse usuário' })
      }
    } catch (error) {
      return res.status(500).send({ msg: 'Ocorreu um erro por parte do servidor', error: error })
    }
  }

  public async forgotPassword(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { email } = req.body
      const user = await User.findOne({ email: email })
      if (user) {
        const token = generateToken()
        const now = new Date()
        const tokenExpirationTime = now.setHours(now.getHours() + 1)
        const updateResetPasswordToken = await User.findOneAndUpdate(email, {
          resetPasswordToken: token,
          resetPasswordTokenExpiration: tokenExpirationTime
        })

        if (updateResetPasswordToken) {
          const isEmailSended = await sendEmailForgotPassword(email, token)
          if (isEmailSended) {
            return res.status(200).send({ msg: `Foi enviado um e-mail para ${email}` })
          } else {
            return res.status(500).send({ error: 'Ocorreu um erro ao enviar o e-mail' })
          }
        }
      } else {
        return res.status(400).send({ error: 'O e-mail informado não está cadastrado no sistema' })
      }
    } catch (error) {
      return res.status(500).send({ error: 'Ocorreu um erro ao prosseguir com a requisição' })
    }
  }
}

export default new UserController();

