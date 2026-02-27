import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import i18n from "@/translations";
import { ScreenConfig } from "@/type";

import Character from "../Character";
import RadioGroupInput from "../form/fields/RadioGroupInput";
import Form from "../form/Form";
import Logo from "../Logo";
import PageActions from "../PageActions";
import PageContainer from "../PageContainer";
import PageDescription from "../PageDescription";
import PageTitle from "../PageTitle";

type Props = {
    config: ScreenConfig;
};

function HubWithCharacter({ config }: Props) {
    const screen = useScreen({ config, onSubmit: () => {} });

    return (
        <PageContainer bgColor={config.screen.bg_color}>
            <Logo
                className="absolute start-5 top-5 size-10"
                flowID={config.appFlow.handle}
                secondary={config.screen.logo_secondary}
                showPictorial
            />
            <Character
                character_lookup_id={config.screen.character_lookup_id as string}
            />
            <PageTitle
                color={config.screen.title.color}
                text={config.screen.title.text}
            />
            <PageDescription
                color={config.screen.description?.color}
                text={config.screen.description?.text}
            />
            <div
                className="
                  my-5 flex items-center py-3 text-lg font-light text-white
                  before:me-6 before:flex-1 before:border-t before:border-white
                  after:ms-6 after:flex-1 after:border-t after:border-white
                "
            >
                {i18n.t("divider.pick_one")}
            </div>
            <Form
                allowSkip={config.screen.flow.allow_skip}
                onSubmit={screen.onSubmit}
            >
                <RadioGroupInput
                    name={screen.name(Strings.input_1)}
                    optionColors={config.screen.options}
                    options={{
                        key: screen.fieldProp(Strings.input_1, Strings.lookupID),
                    }}
                    variant="outlined"
                />
            </Form>
            <PageActions
                isForm
                screen={screen}
            />
        </PageContainer>
    );
}

export default HubWithCharacter;
