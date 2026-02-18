import { createFileRoute } from "@tanstack/react-router";

import ScreenSelector from "@/components/ScreenSelector";
import { Strings } from "@/constants";
import AppFlowsStore from "@/stores/app-flow";

export const Route = createFileRoute("/$flow/$id")({
    component: Page,
});

function Page() {
    const { flow, id } = Route.useParams();

    const [screen, appFlow] = AppFlowsStore.getScreenById(flow, id);

    if (!screen || !appFlow) {
        return <div>{Strings.screenNotFound}</div>;
    }

    return (
        <>
            <ScreenSelector config={{ appFlow, screen }} />
        </>
    );
}
