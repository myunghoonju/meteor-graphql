import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors';
import { json } from 'body-parser';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebApp } from 'meteor/webapp';
import { WebSocketServer } from 'ws';
import  { useServer } from 'graphql-ws/lib/use/ws';

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

    const wsServer = new WebSocketServer({
        noServer: true,
        path: '/graphql'
    })

    WebApp.httpServer.on('upgrade', (request, socket, head) => {
        if (request.url === '/graphql') {
            return wsServer.handleUpgrade(request, socket, head, done = (ws) => {
                wsServer.emit("connection", ws, request)
            })
        } else {
            return;
        }
    })

    const serverCleanUp = useServer({schema}, wsServer);

    const app = express();

    const server = new ApolloServer({
        schema,
        plugins: [
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanUp.dispose()
                        }
                    }
                }
            }
        ]
    });

    // await is necessary
    await server.start();

    app.use(json(), cors(), expressMiddleware(server, {}));

    WebApp.connectHandlers.use('/graphql', app);
})();
