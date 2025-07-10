import { Route } from "./+types/recipes"
import { requireLoggedInUser } from "~/utils/auth.server"
import db from "~/db.server"
import { useLoaderData, Outlet, Form, redirect } from "react-router"
import { RecipeDetailWrapper, RecipeListWrapper, RecipePageWrapper } from "~/components/recipes"
import { SearchBar, PrimaryButton } from "~/components/forms"
import { PlusIcon } from "~/components/icons"

export async function loader({ request }: Route.LoaderArgs) {
    const user = await requireLoggedInUser(request)
    const url = new URL(request.url)
    const q = url.searchParams.get("q")

    const recipes = await db.recipe.findMany({
        where: {
            userId: user.id,
            name: {
                contains: q ?? "",
                mode: "insensitive"
            }
        },
        select: {
            name: true,
            totalTime: true,
            imageUrl: true,
            id: true
        }
    })

    return { recipes }
}

export async function action({ request }: ActionArgs) {
    const user = await requireLoggedInUser(request)

    const recipe = await db.recipe.create({
        data: {
            userId: user.id,
            name: "New Recipe",
            totalTime: "0 min",
            imageUrl: "https://via.placeholder.com/150?text=Remix+Recipes",
            instructions: "",
        }
    })

    return redirect('/app/recipes/${recipe.id}')
}


export default function Recipes() {
    const data = useLoaderData<typeof loader>()

    return (
        <RecipePageWrapper>
            <RecipeListWrapper>
                <SearchBar placeholder="Search Recipes.." />
                <Form method="post" className="mt-4" reloadDocument>
                    <PrimaryButton className="w-full">
                        <div className="flex w-full justify-center">
                            <PlusIcon />
                            <span className="ml-2">Create New Recipe</span>
                        </div>
                    </PrimaryButton>
                </Form>
                <ul>
                    { data?.recipes.map(recipe => (
                        <li className="my-4" key={recipe.id}>
                            <NavLink 
                                reloadDocument to={recipe.id}>
                                    { ({isActive}) => 
                                    <RecipeCard 
                                        name={recipe.name} 
                                        totalTime={recipe.totalTime}
                                        imageUrl={recipe.imageUrl}
                                        isActive={isActive}
                                        />}</NavLink>
                        </li>
                    ))}
                </ul>
            </RecipeListWrapper>
            <RecipeDetailWrapper>
                <Outlet />
            </RecipeDetailWrapper>
        </RecipePageWrapper>
    )
}