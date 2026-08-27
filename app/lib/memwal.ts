import { MemWal } from "@mysten-incubation/memwal";

if (!process.env.MEMWAL_PRIVATE_KEY) {
    throw new Error("MEMWAL_PRIVATE_KEY is missing");
}

if (!process.env.MEMWAL_ACCOUNT_ID) {
    throw new Error("MEMWAL_ACCOUNT_ID is missing");
}

if (!process.env.MEMWAL_SERVER_URL) {
    throw new Error("MEMWAL_SERVER_URL is missing");
}

export const memwal = MemWal.create({
    key: process.env.MEMWAL_PRIVATE_KEY,
    accountId: process.env.MEMWAL_ACCOUNT_ID,
    serverUrl: process.env.MEMWAL_SERVER_URL,
    namespace: "waljob-assist-v3",
});