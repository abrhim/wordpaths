import {
  ActionFunction,
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
} from "remix";
import type { MetaFunction } from "remix";
import globalStyles from "./styles/global.css";
import codyhouseStyles from "./styles/codyhouse.css";
import fontAwesomeStyles from "./styles/fontawesome.css";

export const meta: MetaFunction = () => {
  return { title: "Wordpaths!" };
};

export const links: LinksFunction = () => [
  { href: globalStyles, rel: "stylesheet" },
  { href: codyhouseStyles, rel: "stylesheet" },
  {
    href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css",
    rel: "stylesheet",
  },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
