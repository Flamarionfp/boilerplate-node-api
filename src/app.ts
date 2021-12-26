import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import userRoutes from './routes/user'
class App {
  express: express.Application

  constructor() {
    this.express = express()
    this.middlewares()
    this.routes()
    this.logs()
  }

  private middlewares(): void {
    this.express.use(express.json())
    this.express.use(express.urlencoded({ extended: false }))
    this.express.use(cors())
  }

  private routes(): void {
    this.express.use(userRoutes)
  }

  private logs(): void {
    this.express.use(morgan('dev'))
  }
}

export default new App().express
