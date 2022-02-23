import { ApolloError } from 'apollo-server';
import bcrypt from 'bcrypt';

import { CreateUserInput, LoginInput, UserModel } from '../schema/user.schema';
import Context from '../types/context';
import { signJwt } from '../utils/jwt';

export default class UserService {
  createUser(input: CreateUserInput) {
    return UserModel.create(input);
  }

  async login(input: LoginInput, context: Context) {
    const message = 'Invalid email or password';

    const { email, password } = input;

    const user = await UserModel.find().findByEmail(email).lean();

    if (!user) {
      throw new ApolloError(message);
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new ApolloError(message);
    }

    const accessToken = signJwt(user);

    // set a cookie for the jwt
    context.res.cookie('accessToken', accessToken, {
      maxAge: 3.154e10, // 1 year
      httpOnly: true,
      domain: 'localhost',
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return accessToken;
  }
}
