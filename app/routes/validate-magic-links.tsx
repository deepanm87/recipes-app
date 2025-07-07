import type { LoaderFunction } from "react-router"
import { getMagicLinkPayload, invalidMagicLink } from "~/magic-links.server"
import { getSession } from "~/sessions"

const magicLinkMaxAge = 1000 * 60 * 10

export const loader: LoaderFunction = async ({ request }) => {
    const magicLinkPayload = getMagicLinkPayload(request)

    const createdAt = new Date(magicLinkPayload.createdAt)
    const expiresAt = createdAt.getTime() + magicLinkMaxAge

    if (Date.now() > expiresAt) {
        throw invalidMagicLink("the magic link has expired")
    }

    const cookieHeader = request.headers.get("cookie")
    const session = await getSession(cookieHeader)

    if (session.get("nonce") !== magicLinkPayload.nonce) {
        throw invalidMagicLink("invalid nonce")
    }

    const user = await getUser(magicLinkPayload.email)

    if (user) {
        session.setUserId("userId", user.id)
        reutrn redirect("/app", {
            headers: {
                "Set-Cookie": await commitSession(session)
            }
        })
    }
    
    return {
        headers: {
            "Set-Cookie": await commitSession(session)
        }
    }
}