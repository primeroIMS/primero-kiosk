import { type AnyRouter } from "@tanstack/react-router";
import { Suspense } from "react";

import App from "./App";
import RootErrorBoundary from "./components/RootErrorBoundary";
import preload from "./preload";

type Props = {
    router: AnyRouter;
};

function Root({ router }: Props) {
    return (
        <RootErrorBoundary router={router}>
            <Suspense fallback={<div>Loading...</div>}>
                <App
                    promise={preload}
                    router={router}
                />
            </Suspense>
        </RootErrorBoundary>
    );
}

export default Root;
