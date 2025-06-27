import { PrismaClient } from "../generated/prisma"
const db = new PrismaClient()

function getShelves() {
    return [{
            name: "Dairy",
            items: {
                create: [{ name: "Milk"}, { name: "Eggs" }, { name: "Cheese" }]
            }
        }, {
            name: "Fruits",
            items: {
                create: [{ name: "Apples" }, { name: "Bananas"}]
            }
        }
    ]
}

async function seed() {
    await Promise.all(getShelves().map( shelf => db.pantryShelf.create({ data: shelf })))
}

seed()


