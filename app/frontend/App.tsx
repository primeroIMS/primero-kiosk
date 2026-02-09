import { AnyRouter, RouterProvider } from "@tanstack/react-router";
import { use } from "react";

import "./app.css";

type Props = {
    promise: Promise<unknown>;
    router: AnyRouter;
};

const App = ({ promise, router }: Props) => {
    const data = use(promise);

    return <RouterProvider router={router} />;
};

export default App;
