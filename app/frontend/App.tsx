import { RouterProvider } from "@tanstack/react-router";
import { use } from "react";

import "./app.css";

const App = ({ promise, router }) => {
    const data = use(promise);

    return <RouterProvider router={router} />;
};

export default App;
