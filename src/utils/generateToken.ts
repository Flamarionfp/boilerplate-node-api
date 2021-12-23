import crypto from 'crypto'

const generateToken = (): string => {
  return crypto.randomBytes(10).toString('hex')
}

export default generateToken