import argon2 from 'argon2'
import { User } from './../entities/User';
import { MyContext } from './../types';
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { COOKIE_NAME } from '../constants';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string
  @Field()
  password: string
}

@ObjectType()
class FieldError {
  @Field()
  field: string
  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

const validateUserInput = (options: UsernamePasswordInput) => {
  if (options.username.length <= 2) {
    return {
      errors: [{
        field: 'username',
        message: 'length must be greater than 2'
      }]
    }
  }
  if (options.password.length <= 5) {
    return {
      errors: [{
        field: 'password',
        message: 'length must be greater than 5'
      }]
    }
  }
  return
}

@Resolver()
export class UserResolver {
  @Query(() => UserResponse, { nullable: true })
  async me(
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    console.log(req.session)
    if (!req.session || !req.session.userId) {
      return {
        errors: [{
          field: 'session',
          message: 'User not logged in'
        }]
      }
    }
    const user = await em.findOne(User, { id: req.session.userId })
    if (!user)
      return {
        errors: [{
          field: 'session',
          message: 'User not found'
        }]
      }
    return { user }
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const validationError = validateUserInput(options)
    if (validationError) {
      return validationError
    }
    const hashedPassword = await argon2.hash(options.password)
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword
    })
    try {
      await em.persistAndFlush(user)
    }
    catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err.code === '23505') {
        return {
          errors: [{
            field: 'username',
            message: 'username already taken'
          }]
        }
      }
    }
    req.session.userId = user.id
    return { user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const validationError = validateUserInput(options)
    if (validationError) {
      return validationError
    }
    const user = await em.findOne(User, { username: options.username })
    if (!user) {
      return {
        errors: [{
          field: 'username',
          message: 'User does not exist'
        }]
      }
    }
    const valid = await argon2.verify(user.password, options.password)
    if (!valid) {
      return {
        errors: [{
          field: 'password',
          message: 'Incorrect password'
        }]
      }
    }

    req.session.userId = user.id

    return { user }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME)
        if (err) {
          resolve(false)
          return
        }
        resolve(true)
      }))
  }

}