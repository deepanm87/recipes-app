import { createCookie } from "react-router"

if (typeof import.meta.env.AUTH_COOKIE_SECRET !== "string") {
    throw new Error("Missing env: AUTH_COOKIE_SECRET")
}
export const sessionCookie = createCookie("recipes__session", {
    secrets: [import.meta.env.AUTH_COOKIE_SECRET],
    httpOnly: true,
    secure: true
})

export const themeCookie = createCookie("recipes__theme")