import mongoose from 'mongoose'
import config from '../config'

const { HOST, NAME } = config.database
class Database {
  private host: string;
  private name: string;

  constructor(host: string, name: string) {
    this.host = host
    this.name = name
  }

  public connect(): void {
    mongoose.connect(`mongodb://${this.host}/${this.name}`).then(() => {
      console.log(`Conexão bem sucedida ao Mongo DB - ${this.name}`)
    }).catch((err) => {
      console.log(`Houve um erro ao conectar ao Mongo DB - ${err}`)
    })
  }
}

export default new Database(HOST, NAME)
