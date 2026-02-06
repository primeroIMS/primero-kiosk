import SelectInput from "@/components/form/fields/SelectInput";
import Form from "@/components/form/Form";
import Logo from "@/components/Logo";
import PageTitle from "@/components/PageTitle";
import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import useStore from "@/hooks/use-store";
import i18n, { I18nLocale } from "@/translations";
import { Screen } from "@/type";

import PageActions from "../PageActions";

type Props = {
    config: Screen;
};

function LanguageSelect({ config }: Props) {
    const rtlLanguages = useStore(Strings.systemSettings, Strings.rtlLocales);
    const screen = useScreen({
        config,
        onSubmit: (data) => {
            const selectedLocale = data.global?.language as I18nLocale;
            i18n.locale = selectedLocale;

            if (rtlLanguages.includes(selectedLocale)) {
                document.documentElement.dir = Strings.rtl;
            } else {
                document.documentElement.dir = Strings.ltr;
            }
        },
    });

    return (
        <>
            <Logo />
            <PageTitle
                color={config.title.color}
                text={config.title.text}
            />
            <Form
                className="mb-20"
                onSubmit={screen.onSubmit}
            >
                <SelectInput
                    cyclePlaceholder
                    name={screen.name(Strings.input_1, Strings.language)}
                    optionsConfig={{
                        i18nKey: Strings.locales,
                        key: Strings.locales,
                        store: Strings.systemSettings,
                    }}
                    placeholder={screen.fieldProp(Strings.input_1, Strings.placeholder)}
                />
            </Form>
            <PageActions
                isForm
                screen={screen}
            />
        </>
    );
}

export default LanguageSelect;
