import { createFileRoute } from "@tanstack/react-router";

import Button from "@/components/Button";
import SelectInput from "@/components/form/fields/SelectInput";
import Form from "@/components/form/Form";
import Logo from "@/components/Logo";
import PageContainer from "@/components/PageContainer";
import useStore from "@/hooks/use-store";
import i18n from "@/translations";
import { PrimitiveRecord } from "@/type";

export const Route = createFileRoute("/")({
    component: Page,
});

export default function Page() {
    const color = useStore("theme", "theme.colors.welcome_bg");
    const welcomeTitleColor = useStore("theme", "theme.colors.welcome_title");
    const welcomeText = useStore("theme", "theme.copy.welcome_title");
    const navigate = Route.useNavigate();

    function onSubmit(data: PrimitiveRecord) {
        i18n.locale = data.language as string;
        navigate({ to: "/welcome" });
    }

    return (
        <PageContainer style={{ backgroundColor: color }}>
            <Logo />
            {welcomeText?.[i18n.locale] && (
                <h1
                    className="mb-3 text-center text-3xl font-bold"
                    style={{ color: welcomeTitleColor }}
                >
                    {welcomeText[i18n.locale]}
                </h1>
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
