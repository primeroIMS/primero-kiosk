import { createFileRoute } from "@tanstack/react-router";

import ScreenSelector from "@/components/ScreenSelector";
import { Strings } from "@/constants";
import ScreenStore from "@/stores/screen";

export const Route = createFileRoute("/$flow/$id")({
    component: Page,
});

function Page() {
    const { id } = Route.useParams();

    const screen = ScreenStore.getScreenById(id);

    if (!screen) {
        return <div>{Strings.screenNotFound}</div>;
    }

    return (
        <>
            <ScreenSelector config={screen} />
        </>
    );
}
