import { Lnd } from "./ApiTypes";

export class ApiService {
    constructor(readonly host: string = "http://127.0.0.1:8001") {}

    protected async get<T>(path: string): Promise<T> {
        const res = await fetch(path, { credentials: "include" });
        return await res.json();
    }

    // Exercise: Create a public fetchGraph method that returns Promise<Lnd.Graph>.
    // You can use the `get` helper method above by supplying it with the path /api/graph.
    public async fetchGraph(): Promise<Lnd.Graph> {
        return this.get("/api/graph");
    }
}
