import { MikroORM } from "@mikro-orm/core"
import express from "express"
import { Post } from "./entities/Post"
import mikroOrmConfig from "./mikro-orm.config"

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig)
  await orm.getMigrator().up()

  const app = express()
  app.get('/', (req, res) => {
    res.send('yo man!')
  })
  app.listen(4000, () => {
    console.log('Server started on port 4000')
  })
}

main().catch(error => {
  console.log(error)
})