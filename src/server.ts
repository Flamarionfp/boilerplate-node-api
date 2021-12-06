import App from './app'
import config from './config'
import database from './database'

database.connect()

const { PORT } = config.server

App.listen(PORT, () => {
  console.log(`App listen on ${PORT}`)
})
