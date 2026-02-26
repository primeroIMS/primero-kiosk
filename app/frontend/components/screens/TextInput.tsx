import Form from "@/components/form/Form";
import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { ScreenConfig } from "@/type";

import Character from "../Character";
import FormTextInput from "../form/fields/TextInput";
import Logo from "../Logo";
import PageActions from "../PageActions";
import PageContainer from "../PageContainer";
import PageDescription from "../PageDescription";
import PageTitle from "../PageTitle";

type Props = {
    config: ScreenConfig;
};

function TextInput({ config }: Props) {
    const screen = useScreen({
        config,
        onSubmit: (data) => {},
    });

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
            <Form
                allowSkip={config.screen.flow.allow_skip}
                debug
                onSubmit={screen.onSubmit}
            >
                <FormTextInput
                    name={screen.name(Strings.input_1)}
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

export default TextInput;
