import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import classNames from "classnames"

import type { Route } from "./+types/root";
import { HomeIcon, DiscoverIcon, RecipeBookIcon, SettingsIcon } from "./components/icons"
import "./app.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Recipes App" },
    { name: "description", content: "Recipes app to add recipes and organize a grocery list" },
  ];
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="md:flex md:h-screen">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <nav className="bg-green-800 text-white">
        <ul className="flex md:flex-col">
          <AppNavLink to="/"><HomeIcon /></AppNavLink>
          <AppNavLink to="discover"><DiscoverIcon /></AppNavLink>
          <AppNavLink to="app"><RecipeBookIcon /></AppNavLink>
          <AppNavLink to="settings"><SettingsIcon /></AppNavLink>
        </ul>
      </nav>
      <div className="p-4">
        <Outlet />
      </div>
      
    </>
  )
}

type AppNavLinkProps = {
  children: React.ReactNode
  to: string
}

function AppNavLink({ children, to }: AppNavLinkProps) {
  return (
    <li className="w-16">
      <NavLink to={to}>
        { ({isActive} ) => (
          <div className={classNames("py-4 flex justify-center hover:bg-green-300", 
            { "bg-green-300": isActive }
          )}>
            {children}
          </div>
        ) }
      </NavLink>
    </li>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
