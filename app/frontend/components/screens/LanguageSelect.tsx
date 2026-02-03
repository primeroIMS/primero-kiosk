import isEmpty from "lodash-es/isEmpty";

import Button from "@/components/Button";
import SelectInput from "@/components/form/fields/SelectInput";
import Form from "@/components/form/Form";
import Logo from "@/components/Logo";
import PageTitle from "@/components/PageTitle";
import useScreen from "@/hooks/use-screen";
import i18n from "@/translations";
import { Screen } from "@/type";

import I18nText from "../I18nText";

type Props = {
    config: Screen;
};

function LanguageSelect({ config }: Props) {
    const screen = useScreen(config);

    function onSubmit(data: Record<string, unknown>) {
        i18n.locale = data.global.language as string;
    }

    return (
        <>
            <Logo />
            {!isEmpty(config.title.text) && (
                <PageTitle color={config.title.color}>
                    <I18nText text={config.title.text} />
                </PageTitle>
            )}
            <Form
                className="mb-20"
                onSubmit={onSubmit}
            >
                <SelectInput
                    name={screen.name("input_1", "language")}
                    optionsConfig={{
                        i18nKey: "locales",
                        key: "locales",
                        store: "systemSettings",
                    }}
                    placeholder={screen.prop("input_1", "placeholder")}
                />
            </Form>
            <Button
                form="form"
                type="submit"
                variant="secondary"
            >
                <I18nText
                    fallback="buttons.continue"
                    text={config.flow?.label_next}
                />
            </Button>
        </>
    );
}

export default LanguageSelect;
