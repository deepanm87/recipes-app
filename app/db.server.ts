import { PrismaClient } from "@prisma/client"

type NodeJSGlobal = typeof globalThis

interface CustomNodeJSGlobal extends NodeJSGlobal {
    db: PrismaClient
}

declare const global: CustomNodeJSGlobal

const db = global.db || new PrismaClient()

if (import.meta.env.NODE_ENV === "development") global.db = db

export default db