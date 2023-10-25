import { IGraphService } from "../IGraphService";
import { LndRestClient } from "./LndRestClient";
import { Lnd } from "./LndRestTypes";
import { EventEmitter } from "stream";

/**
 * Provides an adapter for retrieving and subscribing to LND graph data.
 * This adapter isolates our application from the inner workers of
 * connecting to LND via REST. The application understands uses and
 * understands the IGraphService interface.
 */
export class LndGraphService extends EventEmitter implements IGraphService {
    constructor(readonly lnd: LndRestClient) {
        super();
    }

    /**
     * Loads a graph from LND and returns the type. If we were mapping
     * the returned value into a generic Graph type, this would be the
     * place to do it.
     * @returns
     */
    public async getGraph(): Promise<Lnd.Graph> {
        return await this.lnd.getGraph();
    }

    /**
     * Subscribes to LND graph updates and emits `update` events.
     * @param cb
     * @returns
     */
    public async subscribeGraph(): Promise<void> {
        // Exercise: subscribe to the Lnd graph updates using `this.lnd.subscribeGraph`
        // and emit a "update" event each time the handler is called using `this.emit`
        return this.lnd.subscribeGraph((update: Lnd.GraphUpdate) => {
            this.emit("update",update)
        });
    }
}

/**
 * Adds type checking for the emit event
 */
export interface LndGraphService {
    emit(event: "update", update: Lnd.GraphUpdate);
}
