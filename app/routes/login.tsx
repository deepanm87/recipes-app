import { ErrorMessage, PrimaryButton, PrimaryInput } from "~/components/forms"
import { z } from "zod"
import { classNames } from "~/utils/misc"
import { validateForm } from "~/utils/validation"
import { useActionData } from "react-router"
import { getUser } from "~/models/user.server"
import { generateMagicLink } from "~/magic-links.server"
import { sessionCookie } from "~/cookies"
import { getSession, commitSession } from "~/sessions"
import { sendMagicLinkEmail } from "~/magic-links.server"
import type { ActionFunction, LoaderFunction } from "react-router"
import { v4 as uuid } from "uuid"
import { requireLoggedOutUser } from "~/utils/auth.server"

const loginSchema = z.object({
    email: z.string().email()
})

export const loader: LoaderFunction = async ({ request }) => {
    await requireLoggedOutUser(request)
    return null
}

export async function action: ActionFunction = async ({ request }) => {
    await requireLoggedOutUser(request)
    
    const cookieHeader = request.headers.get("cookie")
    const session = await getSession(cookieHeader)
    const formData = await request.formData()

    return validateForm(
        formData,
        loginSchema,
        async ({ email }) => {
            const nonce = uuid()
            session.set("nonce", nonce)
            const link = generateMagicLink(email, nonce)
            await sendMagicLinkEmail(link, email)

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
            { actionData === "ok" ? 
                (
                    <div>
                        <h1 className="text-2xl py-8">Yum!</h1>
                        <p>Check your email and follow the instructions to finish logging in!</p>
                    </div>
                )  :
                (
                    <div>
                        <h1 className="text-3xl mb-8">Recipes</h1>
                        <form method="post" className="mx-auto md:w-1/3">
                            <div className="text-left pb-4">
                                <PrimaryInput 
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    autoComplete="off"
                                    defaultValue={actionData?.email}
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
        </div> 
    )
}