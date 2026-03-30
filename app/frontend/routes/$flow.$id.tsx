import { createFileRoute } from "@tanstack/react-router";

import IdleTimer from "@/components/IdleTimer";
import ScreenSelector from "@/components/ScreenSelector";
import { Strings } from "@/constants";
import AppFlowStore from "@/stores/app-flow";

export const Route = createFileRoute("/$flow/$id")({
    component: Page,
});

function Page() {
    const { flow, id } = Route.useParams();

    const [screen, appFlow] = AppFlowStore.getScreenById(flow, id);

    if (!screen || !appFlow) {
        return <div>{Strings.screenNotFound}</div>;
    }

    return (
        <>
            <ScreenSelector config={{ appFlow, screen }} />
            {appFlow.starting_screen_id !== screen.id && (
                <IdleTimer
                    bgColor={appFlow.meta.idle_timer_bg_color}
                    buttonColor={appFlow.meta.idle_timer_button_color}
                />
            )}
        </>
    );
}
