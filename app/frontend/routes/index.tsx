import { createFileRoute, useNavigate } from "@tanstack/react-router";

import Button from "@/components/Button";
import Logo from "@/components/Logo";
import PageContainer from "@/components/PageContainer";
import useStore from "@/hooks/use-store";
import i18n from "@/translations";

export const Route = createFileRoute("/")({
    component: Page,
});

export default function Page() {
    const bgColor = useStore("theme", "colors.splash_screen");
    const flow = useStore("systemSettings", "flow");
    const navigate = useNavigate();
    const initialScreenId = useStore("systemSettings", "starting_screen_id");

    return (
        <PageContainer
            bgColor={bgColor}
            centered
        >
            <Logo className="mb-20" />
            <Button
                params={{ flow, id: initialScreenId }}
                to="/$flow/$id"
            >
                {i18n.t("buttons.get_started")}
            </Button>
        </PageContainer>
    );
}
