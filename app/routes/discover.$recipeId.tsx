import { data, useLoaderData } from "react-router"
import { DiscoverRecipeDetails, DiscoverRecipeHeader } from "~/components/discover"
import db from "~/db.server"
import { getCurrentUser } from "~/utils/auth.server"
import { hash } from "~/utils/cryptography.server"
import { Route } from "./+types/discover.$recipeId"

export function headers({ loaderHeaders }: Route.HeaderArgs) {
    return {
        etag: loaderHeaders.get("etag"),
        "Cache-Control": `max-age=5, stale-while-revalidate-60`
    }
}

