import { createFileRoute } from "@tanstack/react-router";

import Button from "@/components/Button";
import Logo from "@/components/Logo";
import PageContainer from "@/components/PageContainer";
import useStore from "@/hooks/use-store";
import AppFlowsStore from "@/stores/app-flow";
import i18n from "@/translations";

export const Route = createFileRoute("/")({
    component: Page,
});

export default function Page() {
    const bgColor = useStore("theme", "colors.splash_screen");
    const flow = AppFlowsStore.getFirstAppFlow();

    return (
        <PageContainer
            bgColor={bgColor}
            centered
        >
            <Logo
                className="mb-20"
                flowID={flow?.handle as string}
            />
            <Button
                params={{ flow: flow?.handle, id: flow?.starting_screen_id }}
                to="/$flow/$id"
            >
                {i18n.t("buttons.get_started")}
            </Button>
        </PageContainer>
    );
}
