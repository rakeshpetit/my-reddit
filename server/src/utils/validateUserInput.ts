import { User } from './../entities/User';
import { InputType, Field, ObjectType } from 'type-graphql';

@InputType()
export class UsernamePasswordInput {
  @Field()
  username: string
  @Field()
  password: string
}

@ObjectType()
export class FieldError {
  @Field()
  field: string
  @Field()
  message: string
}


@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

export const validateUserInput = (options: UsernamePasswordInput): UserResponse | undefined => {
  if (options.username.length <= 2) {
    return {
      errors: [{
        field: 'username',
        message: 'length must be greater than 2'
      }]
    };
  }
  if (options.password.length <= 5) {
    return {
      errors: [{
        field: 'password',
        message: 'length must be greater than 5'
      }]
    };
  }
  return;
};
