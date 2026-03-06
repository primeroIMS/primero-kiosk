import SelectInput from "@/components/form/fields/SelectInput";
import Form from "@/components/form/Form";
import Logo from "@/components/Logo";
import PageTitle from "@/components/PageTitle";
import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import useStore from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import i18n, { I18nLocale } from "@/translations";
import { FormValueRecord, FormValues, ScreenConfig } from "@/type";

import PageActions from "../PageActions";
import PageContainer from "../PageContainer";

type Props = {
    config: ScreenConfig;
};

function LanguageSelect({ config }: Props) {
    const rtlLanguages = useStore(Strings.systemSettings, Strings.rtlLocales);
    const screen = useScreen({
        config,
        onSubmit: (data: FormValueRecord | FormValues) => {
            const selectedLocale = (data.global as Record<string, unknown>)
                ?.language as I18nLocale;
            i18n.locale = selectedLocale;

            if (rtlLanguages.includes(selectedLocale)) {
                document.documentElement.dir = Strings.rtl;
            } else {
                document.documentElement.dir = Strings.ltr;
            }

            document.documentElement.lang = selectedLocale;
        },
    });

    return (
        <PageContainer
            bgColor={config.screen.bg_color}
            centered
        >
            <Logo
                className={cn("mb-20", "flex", "justify-center")}
                flowID={config.appFlow.handle}
                imgClassName="max-w-2xs"
            />
            <PageTitle
                color={config.screen.title.color}
                text={config.screen.title.text}
            />
            <Form
                allowSkip={config.screen.flow.allow_skip}
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
        </PageContainer>
    );
}

export default LanguageSelect;
