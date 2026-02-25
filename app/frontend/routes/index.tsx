import { createFileRoute } from "@tanstack/react-router";

import FlowSelector from "@/components/FlowSelector";
import PageContainer from "@/components/PageContainer";
import useStore from "@/hooks/use-store";
import AppFlowStore from "@/stores/app-flow";

export const Route = createFileRoute("/")({
    component: Page,
});

export default function Page() {
    const bgColor = useStore("theme", "colors.splash_screen");
    const flows = AppFlowStore.getAppFlows();

    return (
        <PageContainer
            bgColor={bgColor}
            centered
        >
            <FlowSelector flows={flows} />
        </PageContainer>
    );
}
