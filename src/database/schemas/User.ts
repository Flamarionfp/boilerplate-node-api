import { Schema, model, Document } from 'mongoose'

interface UserInterface extends Document {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone?: string,
  isActive: boolean,
  fullName(): string
}

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  isActive: { type: Boolean, required: true }

}, {
  timestamps: true
})

UserSchema.methods.fullName = function (): string {
  return this.firstName + ' ' + this.lastName
}

export default model<UserInterface>('User', UserSchema)
