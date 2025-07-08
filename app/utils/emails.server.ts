import formData from "form-data"
import Mailgun from "mailgun.js"

if (typeof import.meta.env.MAILGUN_API_KEY !== "string") {
    throw new Error("Missing env: MAILGUN_API_KEY")
}

const mailgun = new Mailgun(formData)
const client = mailgun.client({
    username: "api",
    key: import.meta.env.MAILGUN_API_KEY
})

type Message = {
    from: string
    to: string
    subject: string
    html: string
}

export function sendEmail(message: Message) {
    if (typeof import.meta.env.MAILGUN_DOMAIN !== "string") {
        throw new Error("Missing env: MAILGUN_DOMAIN")
    }
    return client.messages.create(import.meta.env.MAILGUN_DOMAIN, message)
}