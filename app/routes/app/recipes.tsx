import { Route } from "./+types/recipes"
import { requireLoggedInUser } from "~/utils/auth.server"
import db from "~/db.server"
import { useLoaderData, Outlet, Form, redirect, useLocation, NavLink, useNavigation, useFetcher } from "react-router"
import { RecipeDetailWrapper, RecipeListWrapper, RecipePageWrapper, RecipeCard } from "~/components/recipes"
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
        },
        orderBy: {
            createdAt: "desc"
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

    const url = new URL(request.url)
    url.pathname = `app/recipes/${recipe.id}`

    return redirect(url.toString())
}


export default function Recipes() {
    const data = useLoaderData<typeof loader>()
    const location = useLocation()
    const navigation = useNavigation()

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
                    { data?.recipes.map( recipe => {
                        <RecipeListItem key={recipe.id} recipe={recipe} />
                    })}
                </ul>
            </RecipeListWrapper>
            <RecipeDetailWrapper>
                <Outlet />
            </RecipeDetailWrapper>
        </RecipePageWrapper>
    )
}

type RecipeListItemProps = {
    recipe: {
        id: string
        name: string
        totalTime: string
        imageUrl: string
    }
}
function RecipeListItem({ recipe }: RecipeListItemProps) {
    const navigation = useNavigation()
    const location = useLocation()
    const isLoading = navigation.location?.pathname.endsWith(recipe.id)
    const saveNameFetcher = useFetcher({
        key: `save-recipe-name-${recipe.id}`
    })

    const optimisticData = {
        name: saveNameFetcher.formData?.get("name")?.toString()
    }

    return (
        <li className="my-4" key={recipe.id}>
            <NavLink 
                to={{ pathname: recipe.id, search: location.search }}
                prefetch="intent"
            >
                { ({ isActive }) => 
                    <RecipeCard 
                        name={optimisticData.name ?? recipe.name} 
                        totalTime={recipe.totalTime}
                        imageUrl={recipe.imageUrl}
                        isActive={isActive}
                        isLoading={isLoading}
                    />
                }
            </NavLink>
        </li>
    )
}