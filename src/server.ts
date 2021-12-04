import App from './app'
const port = process.env.PORT as unknown as number

App.listen(port || 3333, () => {
  console.log(`App listen on ${port || 3333}`)
})
