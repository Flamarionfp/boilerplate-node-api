import jwt from 'jsonwebtoken'
import authType from '../types/authType'
// @ts-ignore
import auth from '../config/auth'

const authConfig: authType = auth

const generateToken = (params: object): string => {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: authConfig.expirationTime
  })
}

export default generateToken