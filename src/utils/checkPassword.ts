import bcrypt from 'bcryptjs';

const checkPassword = (password: string, hashPassword: string) => {
  return bcrypt.compareSync(password, hashPassword)
}

export default checkPassword