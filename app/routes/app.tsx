import classNames from "classnames"
import { NavLink as RemixNavLink, Outlet } from "react-router"

export default function App() {
    return (
        <div className="flex flex-col h-full">
            <h1 className="text-2xl font-bold my-4">App</h1>
            <nav className="mt-2 pb-2 border-b-2">
                <NavLink to="recipes">Recipes</NavLink>
                <NavLink to="pantry">Pantry</NavLink>
            </nav>
            <div className="py-4 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    )
}

type NavLinkProps = {
    to: string
    children: React.ReactNode
}

function NavLink({ to, children }: NavLinkProps) {
    return (
        <RemixNavLink 
            to={to} 
            className={({ isActive }) => classNames(
                "hover:text-gray-500 pb-2.5 px-2 md:px-4", 
                {
                        "border-b-2 border-b-primary": isActive
                })}
        >
            { children }
        </RemixNavLink>
    )

}