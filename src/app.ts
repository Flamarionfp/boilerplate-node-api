import express from 'express'
import cors from 'cors'
import userRoutes from './routes/user'
class App {
  express: express.Application

  constructor() {
    this.express = express()
    this.middlewares()
    this.routes()
  }

  private middlewares(): void {
    this.express.use(express.json())
    this.express.use(express.urlencoded({ extended: false }))
    this.express.use(cors())
  }

  private routes(): void {
    this.express.use(userRoutes)
  }
}

export default new App().express
