import crypto from 'crypto'

const generateToken = (): string => {
  return crypto.randomBytes(20).toString('hex')
}

export default generateToken