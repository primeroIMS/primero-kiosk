import Button from "@/components/Button";
import SelectInput from "@/components/form/fields/SelectInput";
import Form from "@/components/form/Form";
import Logo from "@/components/Logo";
import PageTitle from "@/components/PageTitle";
import i18n from "@/translations";
import { Screen } from "@/type";

type Props = {
    config: Screen;
};

function LanguageSelect({ config }: Props) {
    function onSubmit(data: Record<string, unknown>) {
        i18n.locale = data.language as string;
    }

    function buildName(prefix: string, name: string) {
        return `${prefix}.${name}`;
    }

    return (
        <>
            <Logo />
            {config.title.text_i18n?.[i18n.locale] && (
                <PageTitle color={config.title.color}>
                    {config.title.text_i18n[i18n.locale]}
                </PageTitle>
            )}
            <Form
                className="mb-20"
                onSubmit={onSubmit}
            >
                <SelectInput
                    name={buildName("settings", "language")}
                    optionsConfig={{
                        i18nKey: "locales",
                        key: "settings.locales",
                        store: "systemSettings",
                    }}
                />
            </Form>
            <Button
                form="form"
                text={config.flow.label_i18n?.[i18n.locale] || "button.continue"}
                type="submit"
                variant="secondary"
            />
        </>
    );
}

export default LanguageSelect;
