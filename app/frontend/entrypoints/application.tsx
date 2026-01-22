import { createRouter } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";

import { routeTree } from "../_routes.gen";
import Root from "../Root";

const router = createRouter({
    defaultPreload: "intent",
    routeTree,
    scrollRestoration: true,
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
    const root = createRoot(rootElement);
    root.render(<Root router={router} />);
}
