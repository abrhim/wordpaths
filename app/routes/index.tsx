import { ActionFunction, LinksFunction, Outlet } from "remix";
import { PathTable } from "~/components/PathTable";
import PathTableStyles from "~/components/PathTable/PathTable.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: PathTableStyles },
];

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>

      <Outlet />
    </div>
  );
}
