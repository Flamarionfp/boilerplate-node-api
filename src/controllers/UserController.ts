import { Request, Response } from 'express'
import User from '../database/schemas/User'
import hashPassword from '../utils/hashPassword'
import checkPassword from '../utils/checkPassword'
import generateJwtToken from '../utils/generateJwtToken'
import generateToken from '../utils/generateToken'
import Mail from '../mail/Mail'

const mail = new Mail()
class UserController {
  public async authUser(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email: email, isActive: true }).select('+password')
      if (!user) {
        return res.status(400).send({ error: 'Usuário não encontrado' })
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
      return res.status(200).send({
        success: true,
        data: users
      })
    } catch (error) {
      return res.status(500).send({
        success: false,
        msg: 'Erro ao buscar usuários',
        error: error
      })
    }
  }

  public async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findById(req.params.id)
      return res.status(200).send({
        success: true,
        data: user
      })
    } catch (error) {
      return res.status(500).send({
        success: false,
        msg: 'Usuário não encontrado',
        error: error
      })
    }
  }

  public async getUserByEmail(req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findOne({ email: req.params.email })
      if (user !== null) {
        return res.status(200).send({
          sucess: true,
          data: user
        })
      } else {
        return res.status(404).send({ error: 'Usuário não encontrado' })
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        msg: 'Usuário não encontrado',
        error: error
      })
    }
  }

  public async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const passwordHashed = await hashPassword(req.body.password)
      const user = await User.create({ ...req.body, password: passwordHashed, isActive: true })
      return res.status(200).send({
        sucesso: true,
        data: { user, token: generateJwtToken({ id: user.id }) },
        msg: 'Usuário cadastrado com sucesso'
      })
    } catch (error) {
      return res.status(500).send({
        success: false,
        msg: 'Falha ao cadastrar usuário',
        error: error
      })
    }
  }

  public async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      if (id === req.userId) {
        const user = await User.findByIdAndUpdate(id, req.body)
        return res.status(200).send({
          success: true,
          data: user,
          msg: 'Usuário atualizado com sucesso'
        })
      } else {
        return res.status(401).send({
          success: false,
          msg: 'Você não pode atualizar os dados desse usuário',
          error: 'unauthorized'
        })
      }
    } catch (error) {
      return res.status(500).send({
        success: true,
        msg: 'Falha ao atualizar usuário'
      })
    }
  }

  // Deletar de forma lógica
  public async removeUser(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { id } = req.params

      if (id === req.userId) {
        const user = await User.findByIdAndUpdate(id, { isActive: false })
        return res.status(200).send({
          success: true,
          data: user,
          msg: 'Usuário removido com sucesso!'
        })
      }
    } catch (error) {
      return res.status(500).send({
        success: true,
        msg: 'Ocorreu um erro por parte do servidor',
        error: error
      })
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { id } = req.params

      if (id === req.userId) {
        const user = await User.findByIdAndDelete(id)
        if (user) {
          return res.status(200).send({
            success: true,
            data: user,
            msg: 'Usuário deletado com sucesso',
          })
        } else {
          return res.status(400).send({
            success: false,
            msg: 'Falha ao deletar usuário'
          })
        }
      } else {
        return res.status(401).send({
          success: false,
          msg: 'Você não pode deletar esse usuário',
          error: 'unauthorized'
        })
      }
    } catch (error) {
      return res.status(500).send({
        msg: 'Ocorreu um erro por parte do servidor',
        error: error
      })
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
          const arePasswordsEqual = checkPassword(password, userPassword)
          if (!arePasswordsEqual) {
            return res.status(400).send({
              success: false,
              msg: 'Senha inválida'
            })
          } else {
            const hashedNewPassword = await hashPassword(newPassword)
            const areNewPasswordEqual = checkPassword(newPassword, userPassword)
            if (!areNewPasswordEqual) {
              const updatedUser = await User.findByIdAndUpdate(id, { password: hashedNewPassword })
              if (updatedUser) {
                return res.status(200).send({
                  success: true,
                  data: user,
                  msg: 'Senha alterada com sucesso'
                })
              } else {
                return res.status(400).send({
                  success: false,
                  msg: 'Erro ao seguir com a requisição'
                })
              }
            } else {
              return res.status(400).send({
                success: false,
                msg: 'A nova senha não pode ser igual a anterior'
              })
            }
          }
        } else {
          return res.status(400).send({
            success: false,
            msg: 'Erro, usuário não encontrado'
          })
        }
      } else {
        return res.status(401).send({
          success: false,
          msg: 'Você não pode alterar a senha desse usuário',
          error: 'unauthorized'
        })
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        msg: 'Ocorreu um erro por parte do servidor',
        error: error
      })
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
          const isEmailSended = mail.sendEmail(email, { token }, 'Recuperar senha', 'forgotPassword')
          if (isEmailSended) {
            return res.status(200).send({
              success: true,
              msg: `Foi enviado um e-mail para ${email}`
            })
          } else {
            return res.status(500).send({
              success: false,
              msg: 'Ocorreu um erro ao enviar o e-mail'
            })
          }
        }
      } else {
        return res.status(400).send({
          success: true,
          msg: 'O e-mail informado não está cadastrado no sistema'
        })
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        msg: 'Ocorreu um erro ao prosseguir com a requisição',
        error: error
      })
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<Response> {
    try {
      const { token, password } = req.body
      const user = await User.findOne({ resetPasswordToken: token }).select('+resetPasswordTokenExpiration +password')
      if (user) {
        const now = Date.now()
        if (user.resetPasswordTokenExpiration) {
          if (now < user.resetPasswordTokenExpiration) {
            if (password !== user.password) {
              const hashedNewPassword = await hashPassword(password)
              const userResetPassword = await User.findByIdAndUpdate(user.id, { password: hashedNewPassword })
              if (userResetPassword) {
                return res.status(200).send({
                  success: true,
                  msg: 'Sua senha foi redefinida com sucesso'
                })
              } else {
                return res.status(500).send({
                  success: false,
                  msg: 'Erro ao redefinir senha'
                })
              }
            } else {
              return res.status(4000).send({
                success: false,
                msg: 'A nova senha não pode ser igual a anterior'
              })
            }
          } else {
            return res.status(400).send({
              success: false,
              msg: 'Token expirado'
            })
          }
        } else {
          return res.status(500).send({
            success: false,
            msg: 'Erro ao prosseguir com a requisição'
          })
        }
      } else {
        return res.status(400).send({
          success: false,
          msg: 'Token inválido'
        })
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        msg: 'Erro ao prosseguir com a requisição',
        error: error
      })
    }
  }
}

export default new UserController();

