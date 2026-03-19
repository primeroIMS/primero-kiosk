import { CSPProvider } from "@base-ui/react/csp-provider";

import "./app.css";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { AnyRouter, RouterProvider } from "@tanstack/react-router";
import { use } from "react";
type Props = {
    promise: Promise<unknown>;
    router: AnyRouter;
};

const App = ({ promise, router }: Props) => {
    use(promise);

    return (
        <CSPProvider disableStyleElements>
            <DirectionProvider>
                <RouterProvider router={router} />
            </DirectionProvider>
        </CSPProvider>
    );
};

export default App;
