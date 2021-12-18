import jwt from 'jsonwebtoken'
import authType from '../types/authType'
// @ts-ignore
import auth from '../config/auth'

const authConfig: authType = auth

const generateJwtToken = (params: object): string => {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: authConfig.expirationTime
  })
}

export default generateJwtToken