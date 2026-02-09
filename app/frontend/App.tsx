import { DirectionProvider } from "@base-ui/react/direction-provider";

import "./app.css";
import { AnyRouter, RouterProvider } from "@tanstack/react-router";
import { use } from "react";

type Props = {
    promise: Promise<unknown>;
    router: AnyRouter;
};

const App = ({ promise, router }: Props) => {
    const data = use(promise);

    return (
        <DirectionProvider>
            <RouterProvider router={router} />
        </DirectionProvider>
    );
};

export default App;
