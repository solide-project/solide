import { GlacierClient, InsertResult } from "@glacier-network/client";
import { Gateway } from "./glacier-gateway";
import { DBSoliditySchema } from "../models/glacier-solidity-schema";

const SOLIDE_NAMESPACE = "solide";
const SOLIDE_TEST_DATASET = "test";
const SOLIDE_MAIN_DATASET = "main";
const SOLIDE_COLLECTION = "v0";

/**
 * Swap these two lines to switch between test and main dataset
 */
const SOLIDE_DATASET = SOLIDE_TEST_DATASET || SOLIDE_MAIN_DATASET

export class GlacierService {
    private client: GlacierClient;
    private namespace: string;
    private dataset: string;
    private collection: string;

    constructor(
        gateway: string = Gateway.Filecoin
    ) {
        this.namespace = SOLIDE_NAMESPACE;
        this.dataset = SOLIDE_DATASET;
        this.collection = SOLIDE_COLLECTION;
        this.client = new GlacierClient(gateway, {
            privateKey: process.env.GLACIER_ACCOUNT,
        });
    }

    private db() {
        return this.client
            .namespace(this.namespace)
            .dataset(this.dataset)
            .collection(this.collection);
    }

    async insertOne({
        bytecode,
        input,
    }: {
        bytecode: string,
        input: string
    }): Promise<InsertResult> {
        const now = Date.now();
        return await this.db()
            .insertOne({
                bytecode: bytecode,
                input: input,
                createdAt: now,
                updatedAt: now,
            });
    }

    async find(hash: string): Promise<DBSoliditySchema[]> {
        return await this.db()
            .find({
                bytecode: {
                    $eq: hash,
                },
            })
            .skip(0)
            .limit(5)
            .toArray() as DBSoliditySchema[];
    }

    /**
     * Checks if the provided data array exists and has elements.
     * @param data - The array to check.
     * @returns A promise resolving to a boolean indicating if the array exists and has elements.
     */
    exist(data: DBSoliditySchema[]): boolean {
        return data && data.length > 0;
    }

    /**
     * This should only be called once to initialize the database 
     */
    async initDB() {
        try {
            const ns = await this.client.createNamespace(this.namespace);
            console.log(ns);
        } catch (error) {
            console.log(error)
        }

        try {
            const project = this.client.namespace(this.namespace);
            const ds = await project.createDataset(this.dataset);
            console.log(ds)
        } catch (error) {
            console.log(error)
        }

        try {
            const project = this.client.namespace(this.namespace);
            await project.dataset(this.dataset).createCollection(this.collection, {
                title: 'Notes',
                type: 'object',
                properties: {
                    // Bytecode hashed
                    bytecode: {
                        type: 'string',
                    },
                    // Bytecode input
                    input: {
                        type: 'string',
                    },
                    createdAt: {
                        type: 'number',
                    },
                    updatedAt: {
                        type: 'number',
                    },
                },
            });
        } catch (error) {
            console.log(error)
        }
    }
}
