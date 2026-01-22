import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import App from "./App";

describe("App", async () => {
    it("renders App component", () => {
        const mockPromise = Promise.resolve();
        const mockRouter = {};
        render(
            <App
                promise={mockPromise}
                router={mockRouter}
            />,
        );
        expect(screen.getByText("App Component")).toBeInTheDocument();
    });
});
