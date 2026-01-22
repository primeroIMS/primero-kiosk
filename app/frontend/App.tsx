import { RouterProvider } from "@tanstack/react-router";

import "./app.css";
import { use } from "react";

const App = ({ promise, router }) => {
    const data = use(promise);

    return <RouterProvider router={router} />;
};

export default App;
