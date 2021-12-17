import App from './app'
import database from './database'
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/.env' });

database.connect()

const PORT = process.env.PORT

App.listen(PORT, () => {
  console.log(`App listen on ${PORT}`)
})
