import { createFileRoute } from "@tanstack/react-router";

import Button from "@/components/Button";
import PageContainer from "@/components/PageContainer";
import PageTitle from "@/components/PageTitle";
import useStore from "@/hooks/use-store";
import i18n from "@/translations";

export const Route = createFileRoute("/goodbye")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = Route.useNavigate();
    const bgColor = useStore("theme", "theme.colors.response_bg");
    const headerColor = useStore("theme", "theme.colors.response_header");
    const headerText = useStore("theme", "theme.copy.response_header");
    const responseBody = useStore("theme", "theme.copy.response_body");
    const responseBodyColor = useStore("theme", "theme.colors.response_body");
    const hero = useStore("theme", "theme.response_hero");

    return (
        <PageContainer style={{ backgroundColor: bgColor }}>
            <img
                alt="Response Hero"
                className="mb-8"
                src={hero as string}
            />
            <PageTitle color={headerColor}>{headerText[i18n.locale]}</PageTitle>
            <p
                className="text-lg mb-20"
                style={{ color: responseBodyColor }}
            >
                {responseBody[i18n.locale]}
            </p>
            <Button
                className="bg-blue border-2 text-white"
                to="/"
                variant="outline"
            >
                {i18n.t("buttons.done")}
            </Button>
        </PageContainer>
    );
}
