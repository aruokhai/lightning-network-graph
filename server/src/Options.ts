import "dotenv/config";
import fs from "fs/promises";

/**
 * Options and configurations used by the application
 */
export class Options {
    /**
     * Constructs an Options instance from environment variables
     * @returns
     */
    public static async fromEnv(): Promise<Options> {
        const port = Number(process.env.PORT);
        const host: string = process.env.LND_HOST;
        const macaroon: Buffer = await fs.readFile(process.env.LND_READONLY_MACAROON_PATH);
        const cert: Buffer = await fs.readFile(process.env.LND_CERT_PATH);

        return new Options(port, host, macaroon, cert);
    }

    constructor(
        readonly port: number,
        readonly lndHost: string,
        readonly lndReadonlyMacaroon: Buffer,
        readonly lndCert: Buffer,
    ) {}
}
