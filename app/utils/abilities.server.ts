import { data } from "react-router"
import db from "~/db.server"
import { requireLoggedInUser } from "./auth.server"

export async function canChangeRecipe(request: Request, recipeId: string) {
    const user = await requireLoggedInUser(request)
    const recipe = await db.recipe.findUnique({
        where: {
            id: recipeId
        }
    })

    if (recipe === null) {
        throw data(
            { message: "A recipe with that id does not exist" },
            { status: 401 }
        )
    }
}