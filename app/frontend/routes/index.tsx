import { createFileRoute } from "@tanstack/react-router";

import Button from "@/components/Button";
import SelectInput from "@/components/form/fields/SelectInput";
import Form from "@/components/form/Form";
import Logo from "@/components/Logo";
import PageContainer from "@/components/PageContainer";
import i18n from "@/translations";
import { PrimitiveRecord } from "@/type";

export const Route = createFileRoute("/")({
    component: Page,
});

export default function Page() {
    const color = "#33433b";
    const navigate = Route.useNavigate();

    function onSubmit(data: PrimitiveRecord) {
        i18n.locale = data.language as string;
        navigate({ to: "/welcome" });
    }

    return (
        <PageContainer style={{ backgroundColor: color }}>
            <Logo />
            <Form
                className="mb-25"
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
