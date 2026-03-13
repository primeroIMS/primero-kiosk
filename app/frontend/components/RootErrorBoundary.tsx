import { Component, type ReactNode } from "react";

import i18n from "@/translations";

import Button from "./Button";
import PageContainer from "./PageContainer";
import PageDescription from "./PageDescription";
import PageTitle from "./PageTitle";

type ErrorBoundaryProps = {
    children: ReactNode;
};

type ErrorBoundaryState = {
    error: Error | null;
};

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error };
    }

    handleTryAgain = () => {
        window.location.reload();
    };

    render() {
        if (this.state.error) {
            return (
                <PageContainer
                    bgColor="#FF6467"
                    centered
                >
                    <div className="mb-15">
                        <PageTitle
                            color="#ffffff"
                            text="error.title"
                        />
                        <PageDescription
                            className="
                              text-center text-sm whitespace-pre-line text-foreground
                              md:text-lg
                            "
                            color="#ffffff"
                            text="error.description"
                        />
                    </div>
                    <Button
                        bgColor="#ffffff"
                        onClick={this.handleTryAgain}
                        textColor="#000000"
                    >
                        {i18n.t("buttons.try_again")}
                    </Button>
                </PageContainer>
            );
        }

        return this.props.children;
    }
}

export default RootErrorBoundary;
