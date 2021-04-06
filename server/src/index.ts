import 'reflect-metadata'
import { ApolloServer } from "apollo-server-express"
import express from "express"
import redis from "redis"
import session from 'express-session'
import connectRedis from 'connect-redis'
import { buildSchema } from "type-graphql"
import cors from 'cors'
import { createConnection } from 'typeorm'
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/post"
import { UserResolver } from './resolvers/user';
import { COOKIE_NAME, __prod__ } from './constants'
import { MyContext } from './types'
import { Post } from './entities/Post'
import { User } from './entities/User';
import { Updoot } from './entities/Updoot'

const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    database: 'reddit2',
    username: 'postgres',
    password: 'postgres',
    logging: true,
    synchronize: true,
    entities: [Post, User, Updoot],
  })

  const app = express()

  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient()

  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__
      },
      saveUninitialized: false,
      secret: 'secret',
      resave: false,
    })
  )
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }): MyContext => ({ req, res })
  })

  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(4000, () => {
    console.log('Server started on port 4000')
  })
}

main().catch(error => {
  console.log(error)
})