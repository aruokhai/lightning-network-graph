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

async function run() {
    const options = await Options.fromEnv();
    const lnd = new LndRestClient(options.lndHost, options.lndReadonlyMacaroon, options.lndCert);
    const lndGraphAdapter: IGraphService = new LndGraphService(lnd);

    // construction application
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

    // mount routers here
    app.use(graphApi(lndGraphAdapter));

    // start the server on the port
    const server = app.listen(Number(options.port), () => {
        console.log(`server listening on ${options.port}`);
    });

    // start the socket server
    const socketServer = new SocketServer();

    // start listening for http connections
    socketServer.listen(server);

    // attach an event handler for graph updates and broadcast them
    // to WebSocket using the socketServer.
    lndGraphAdapter.on("update", (update: Lnd.GraphUpdate) => {
        socketServer.broadcast("graph", update);
    });

    // subscribe to graph updates
    lndGraphAdapter.subscribeGraph();
}

run().catch(ex => {
    console.error(ex);
    process.exit(1);
});