import argon2 from 'argon2'
import { User } from './../entities/User';
import { MyContext } from './../types';
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { COOKIE_NAME } from '../constants';
import { UsernamePasswordInput, UserResponse, validateUserInput } from '../utils/validateUserInput';

@Resolver()
export class UserResolver {
  @Query(() => UserResponse, { nullable: true })
  async me(
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    if (!req.session || !req.session.userId) {
      return {
        errors: [{
          field: 'session',
          message: 'User not logged in'
        }]
      }
    }
    const user = await User.findOne(req.session.userId)
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
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const validationError = validateUserInput(options)
    if (validationError) {
      return validationError
    }
    const hashedPassword = await argon2.hash(options.password)
    let user
    try {
      user = await User.create({
        username: options.username,
        password: hashedPassword
      }).save()
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
    if (user)
      req.session.userId = user.id
    return { user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const validationError = validateUserInput(options)
    if (validationError) {
      return validationError
    }
    const user = await User.findOne({ where: { username: options.username } })
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