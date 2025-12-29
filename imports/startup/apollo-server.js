import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors';
import { json } from 'body-parser';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebApp } from 'meteor/webapp';

import resolveItem from '/imports/api/item/resolvers';
import typeDefItem from '/imports/api/item/schemas';
import resolveOrder from '/imports/api/order/resolvers';
import typeDefOrder from '/imports/api/order/schemas';

(async function() {
    const typeDefs = [typeDefItem, typeDefOrder];
    const resolvers = [resolveItem, resolveOrder];

    const schema = makeExecutableSchema({
        typeDefs, resolvers
    });

    const app = express();

    const server = new ApolloServer({
        schema
    });

    // await is necessary
    await server.start();

    app.use(json(), cors(), express.json(), expressMiddleware(server, {}));

    WebApp.connectHandlers.use('/graphql', app);
})();
