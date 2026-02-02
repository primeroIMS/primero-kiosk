import { createFileRoute } from "@tanstack/react-router";

import PageContainer from "@/components/PageContainer";
import ScreenSelector from "@/components/ScreenSelector";
import { STRINGS } from "@/constants";
import ScreenStore from "@/stores/screen";

export const Route = createFileRoute("/screens/$id")({
    component: Page,
});

function Page() {
    const { id } = Route.useParams();

    const screen = ScreenStore.getScreenById(id);

    if (!screen) {
        return <div>{STRINGS.screenNotFound}</div>;
    }

    return (
        <PageContainer style={{ backgroundColor: screen?.bg_color }}>
            <ScreenSelector config={screen} />
        </PageContainer>
    );
}
