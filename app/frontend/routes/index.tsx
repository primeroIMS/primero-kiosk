import { createFileRoute } from "@tanstack/react-router";

import Button from "@/components/Button";
import SelectInput from "@/components/form/fields/SelectInput";
import Form from "@/components/form/Form";
import Logo from "@/components/Logo";
import PageContainer from "@/components/PageContainer";
import PageTitle from "@/components/PageTitle";
import useStore from "@/hooks/use-store";
import i18n from "@/translations";
import { PrimitiveRecord } from "@/type";

export const Route = createFileRoute("/")({
    component: Page,
});

export default function Page() {
    const bgColor = useStore("theme", "theme.colors.welcome_bg");
    const welcomeTitleColor = useStore("theme", "theme.colors.welcome_title");
    const welcomeText = useStore("theme", "theme.copy.welcome_title");
    const navigate = Route.useNavigate();

    function onSubmit(data: PrimitiveRecord) {
        i18n.locale = data.language as string;
        navigate({ to: "/goodbye" });
    }

    return (
        <PageContainer style={{ backgroundColor: bgColor }}>
            <Logo />
            {welcomeText?.[i18n.locale] && (
                <PageTitle color={welcomeTitleColor}>
                    {welcomeText[i18n.locale]}
                </PageTitle>
            )}
            <Form
                className="mb-20"
                debug
                onSubmit={onSubmit}
            >
                <SelectInput
                    getI18nLabelFromName
                    name="language"
                    optionsConfig={{
                        i18nKey: "locales",
                        key: "settings.locales",
                        store: "systemSettings",
                    }}
                />
            </Form>
            <Button
                form="form"
                text="buttons.continue"
                type="submit"
                variant="secondary"
            />
        </PageContainer>
    );
}
