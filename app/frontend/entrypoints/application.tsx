import { createRouter } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";

import { Strings } from "@/constants";

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

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register(import.meta.env.DEV ? "/dev-sw.js" : "/sw.js", {
                type: import.meta.env.DEV ? "module" : "classic",
            })
            .then((reg) => console.log("SW registered:", reg.scope))
            .catch((err) => console.log("SW registration failed:", err));
    });
}

const rootElement = document.getElementById(Strings.app)!;

if (!rootElement.innerHTML) {
    const root = createRoot(rootElement);
    root.render(<Root router={router} />);
}
