import { ErrorMessage, PrimaryButton } from "~/components/forms"
import { Route } from "./+types/login"
import { z } from "zod"

const loginSchema = z.object({
    email: z.string().email()
})

export async function action({ request}: Route.ActionArgs) {
    const formData = await request.formData()

    return validateForm(
        formData,
        loginSchema,
        ({ email }) => {},
        errors => data({ errors, email: formData.get("email")?.toString() })
    )
}

export default function Login() {
    const actionData = useActionData<typeof action>()
    return (
        <div className="text-center mt-36">
            <h1 className="text-3xl mb-8">Recipes</h1>
            <form method="post" className="mx-auto md:w-1/3">
                <div className="text-left pb-4">
                    <input 
                        type="email"
                        name="email"
                        placeholder="Email"
                        autoComplete="off"
                        defaultValue={actionData?.email}
                        className="w-full outline-none border-2 border-gray-200 focus:border-primary rounded-md p-2"
                    />
                    <ErrorMessage>
                        { actionData?.errors?.email }
                    </ErrorMessage>
                </div>
                <PrimaryButton className="w-1/3 mx-auto">Log In</PrimaryButton>
            </form>
        </div>
    )
}