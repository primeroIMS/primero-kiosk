import { createFileRoute } from "@tanstack/react-router";

import PageContainer from "@/components/PageContainer";

export const Route = createFileRoute("/welcome")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <PageContainer>
            <div>Hello "/welcome"!</div>
        </PageContainer>
    );
}
