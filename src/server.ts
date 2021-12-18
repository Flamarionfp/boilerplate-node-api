import App from './app'
import database from './database'
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + '/.env' });
database.connect()

const { PORT_SERVER } = process.env

App.listen(PORT_SERVER, () => {
  console.log(`App listen on ${PORT_SERVER}`)
})
