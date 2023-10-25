import path from "path";
import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import serveStatic from "serve-static";

import { LndGraphService } from "./domain/lnd/LndGraphService";
import { LndRestClient } from "./domain/lnd/LndRestClient";
import { Options } from "./Options";
import { SocketServer } from "./SocketServer";
import { IGraphService } from "./domain/IGraphService";
import { graphApi } from "./api/GraphApi";
import { Lnd } from "./domain/lnd/LndRestTypes";

/**
 * Entry point for our application. This is responsible for setting up
 * the dependency graph and constructing the application. As this code
 * gets more complicated it can be broken into various pieces so we
 * no longer violate the single responsibility principle.
 */
async function run() {
    // construct the options
    const options = await Options.fromEnv();

    // Exercise: using the Options defined above, construct an instance
    // of the LndRestClient using the options.
    const lnd: LndRestClient = new LndRestClient(options.lndHost, options.lndReadonlyMacaroon, options.lndCert);

    // construct an IGraphService for use by the application
    const graphAdapter: IGraphService = new LndGraphService(lnd);

    // construction the server
    const app: express.Express = express();

    // mount json and compression middleware
    app.use(bodyParser.json());
    app.use(compression());

    // mount public endpoints for our app
    app.use("/public", serveStatic(path.join(__dirname, "../public")));
    app.use("/public/app", serveStatic(path.join(__dirname, "../../client/dist/app")));
    app.use("/public/css", serveStatic(path.join(__dirname, "../../style/dist/css")));

    // mount the root to render our default webpage which will load the react app
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    // mount our API routers
    app.use(graphApi(graphAdapter));

    // start the server on the port
    const server = app.listen(Number(options.port), () => {
        console.log(`server listening on ${options.port}`);
    });

    // construct the socket server
    const socketServer = new SocketServer();

    // start listening for http connections using the http server
    socketServer.listen(server);

    // attach an event handler for graph updates and broadcast them
    // to WebSocket using the socketServer.
    graphAdapter.on("update", (update: Lnd.GraphUpdate) => {
        socketServer.broadcast("graph", update);
    });

    // subscribe to graph updates
    graphAdapter.subscribeGraph();
}

run().catch(ex => {
    console.error(ex);
    process.exit(1);
});
