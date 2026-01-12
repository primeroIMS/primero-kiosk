import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import App from "./App";

describe("App", async () => {
    it("renders App component", () => {
        render(<App />);
        expect(screen.getByText("App Component")).toBeInTheDocument();
    });
});
