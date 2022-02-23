import dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import express from 'express';
import { buildSchema } from 'type-graphql';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from 'apollo-server-core';
import config from 'config';

import { resolvers } from './resolvers';
import connect from './utils/connect';
import Context from './types/context';
import { verifyJwt } from './utils/jwt';
import authChecker from './utils/authChecker';
import { User } from './schema/user.schema';

async function bootstrap() {
  // Build the schema
  const schema = await buildSchema({
    resolvers,
    authChecker,
  });

  // Init express
  const app = express();

  app.use(cookieParser());

  // Create the apollo server
  const server = new ApolloServer({
    schema,
    context: (ctx: Context) => {
      const context = ctx;

      if (ctx.req.cookies.accessToken) {
        const user = verifyJwt<User>(ctx.req.cookies.accessToken);
        context.user = user;
      }
      return context;
    },
    plugins: [
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await server.start();

  // apply middleware to server
  server.applyMiddleware({ app });

  // App.listen on express server
  const port = config.get<number>('port');

  app.listen(port, () => {
    console.log(`App is listenning on http://localhost:${port}`);
  });

  // Connect to db
  connect();
}

bootstrap();
