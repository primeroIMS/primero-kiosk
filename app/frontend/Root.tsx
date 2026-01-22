import { type AnyRouter } from "@tanstack/react-router";
import { Suspense } from "react";

import App from "./App";
import preload from "./preload";

type Props = {
    router: AnyRouter;
};

function Root({ router }: Props) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <App
                promise={preload}
                router={router}
            />
        </Suspense>
    );
}

export default Root;
