import Cryptr from "cryptr"
import { renderToStaticMarkup } from "react-dom/server"
import { sendEmail } from "./utils/emails.server"

if (typeof import.meta.env.MAGIC_LINK_SECRET !== "string") {
    throw new Error("Missing env: MAGIC_LINK_SECRET")
}

const cryptr = new Cryptr()

type MagicLinkPayload = {
    email: string
    nonce: string
    createAt: string
}

export function generateMagicLink(email: string, nonce: string) {
    const payload: MagicLinkPayload = {
        email, 
        nonce,
        createAt: new Date().toISOString()
    }
    const encryptedPayload = cryptr.encrypt(JSON.stringify(payload))

    if (typeof import.meta.env.ORIGIN !== "string") {
        throw new Error("Missing env: ORIGIN")
    }

    const url = new URL(import.meta.env.ORIGIN)
    url.pathname = "/validate-magic-link"
    url.searchParams.set("magic", encryptedPayload)
    return url.toString()
}

function isMagicLinkPayload(value: any): value is MagicLinkPayload {
    return (
        typeof value === "object" && 
        typeof value.email === "string" &&
        typeof value.nonce === 'string' &&
        typeof value.createAt === "string"
    )
}

function invalidMagicLink(message: string) {
    return { message }
}

export function getMagicLinkPayload(request: Request) {
    const url = new URL(request.url)
    const magic = url.searchParams.get("magic")

    if (typeof magic !== "string") {
        throw invalidMagicLink("magic search parameter doesn't exist")
    }
    const magicLinkPayload = JSON.parse(cryptr.decrypt(magic))

    if (!isMagicLinkPayload(magicLinkPayload)) {
        throw invalidMagicLink("invalid magic link payload")
    }

    return magicLinkPayload
}

export function sendMagicLinkEmail(link: string, email: string) {
    if (import.meta.env.NODE_ENV === "production") {
        const html = renderToStaticMarkup(
        <div>
            <h1>Login to Recipes</h1>
            <p>Hey, there! Click the link below to finish logging into the Recipes app.</p>
            <a href={link}>Log In</a>
        </div>
    )
    return sendEmail({
        from: "Recipes <deep.mgn@gmail.com>",
        to: email,
        subject: "Log in to Recipes!",
        html
    })
    } else {
        console.log(link)
    }
    
}