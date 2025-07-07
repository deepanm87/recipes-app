import { ErrorMessage, PrimaryButton } from "~/components/forms"
import { z } from "zod"
import { classNames } from "~/utils/misc"
import { validateForm } from "~/utils/validation"
import { useActionData } from "react-router"
import { getUser } from "~/models/user.server"
import { generateMagicLink } from "~/magic-links.server"
import { sessionCookie } from "~/cookies"
import { getSession, commitSession } from "~/sessions"
import type { ActionFunction, LoaderFunction } from "react-router"
import { v4 as uuid } from "uuid"

const loginSchema = z.object({
    email: z.string().email()
})

export const loader: LoaderFunction = async ({ request }) => {
    const cookieHeader = request.headers.get("cookie")
    const session = await getSession(cookieHeader)
    return null
}

export async function action: ActionFunction = async ({ request }) => {
    const cookieHeader = request.headers.get("cookie")
    const session = await getSession(cookieHeader)
    const formData = await request.formData()

    return validateForm(
        formData,
        loginSchema,
        async ({ email }) => {
            const nonce = uuid()
            session.flash("nonce", nonce)
            const link = generateMagicLink(email, nonce)
            return { 
                headers: {
                    "Set-cookie": await commitSession(session)
                }
            }
        },
        errors => ({ errors, email: formData.get("email")?.toString() })
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