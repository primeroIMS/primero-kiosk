import { createFileRoute } from "@tanstack/react-router";

import Button from "@/components/Button";
import Character from "@/components/Character";
import ExitFlow from "@/components/ExitFlow";
import Logo from "@/components/Logo";
import PageContainer from "@/components/PageContainer";
import PageDescription from "@/components/PageDescription";
import PageTitle from "@/components/PageTitle";
import { ENDPOINTS, Strings } from "@/constants";
import useStore from "@/hooks/use-store";
import api from "@/lib/api-client";
import AppFlowStore from "@/stores/app-flow";
import i18n from "@/translations";

export const Route = createFileRoute("/$flow/error")({
    component: Page,
});

function Page() {
    const { flow } = Route.useParams();
    const appFlow = AppFlowStore.getAppFlowByHandle(flow);
    const dataToSend = useStore(Strings.form, Strings.retryRecord);
    const successNextScreen = useStore(Strings.form, Strings.retrySuccessNextScreen);
    const navigate = Route.useNavigate();

    async function handleTryAgain() {
        try {
            const response = await api.post(ENDPOINTS.records, dataToSend);
            if (response.status === 204) {
                navigate({
                    params: { flow, id: successNextScreen },
                    to: "/$flow/$id",
                });
            }
        } catch (error) {
            console.error("Error submitting data on retry:", error);
        }
    }

    function handleExit() {
        // show confirmation dialog before exiting
        navigate({
            params: { flow, id: appFlow?.starting_screen_id as string },
            to: "/$flow/$id",
        });
    }

    return (
        <PageContainer
            bgColor={appFlow?.meta.error_bg_color || "#FF6467"}
            centered
        >
            <Logo
                className="absolute start-5 top-5 size-10"
                flowID={appFlow?.handle as string}
                showPictorial
            />
            <div className="mb-8 md:mb-15">
                <div className="relative mx-auto aspect-square w-50">
                    <Character
                        character_lookup_id={"character_worried" as string}
                        className="absolute bottom-0 size-50! bg-yellow-200"
                    />
                </div>
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
            <div className="flex w-full justify-center gap-4">
                <Button
                    bgColor={appFlow?.meta.error_text_color || "#FFFFFF"}
                    onClick={handleTryAgain}
                    textColor={appFlow?.meta.error_bg_color || "#000000"}
                >
                    {i18n.t("buttons.try_again")}
                </Button>
                <ExitFlow
                    bgColor={appFlow?.meta.error_bg_color || "#000000"}
                    buttonProps={{
                        bgColor: appFlow?.meta.error_text_color || "#FFFFFF",
                        className: "",
                        textColor: appFlow?.meta.error_bg_color || "#000000",
                        variant: "default",
                    }}
                    onExit={handleExit}
                    routeParamsFrom="/$flow/error"
                />
            </div>
        </PageContainer>
    );
}

export default Page;
