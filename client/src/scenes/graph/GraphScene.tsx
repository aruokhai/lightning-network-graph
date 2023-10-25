import React, { useEffect, useRef } from "react";
import { useSocket } from "../../hooks/UseSocket";
import { useApi } from "../../hooks/UseApi";
import { Lnd } from "../../services/ApiTypes";
import { Graph } from "./components/Graph";

export const GraphScene = () => {
    const api = useApi();
    const graphRef = useRef<Graph>();

    useEffect(() => {
        // Exercise: Using the api, call the fetchGraph method. Since
        // this returns a promise, we need to use the `then` method to
        // retrieve the results. With the results, call
        // `graphRef.current.createGraph`
        api.fetchGraph().then((graph: Lnd.Graph) => {
            console.log(graph);
            graphRef.current.createGraph(graph)
        });
    }, []);

    useSocket("graph", (update: Lnd.GraphUpdate) => {
        // Exercise: Call `graphRef.current.updateGraph` with the update
        graphRef.current.updateGraph(update);
    });

    return (
        <div className="container-fluid h-100">
            <div className="row h-100">
                <div className="col h-100">{<Graph ref={graphRef} />}</div>
            </div>
        </div>
    );
};
