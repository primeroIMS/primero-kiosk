import Form from "@/components/form/Form";
import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { ScreenConfig } from "@/type";

import CheckboxGroup from "../form/fields/CheckboxGroup";
import TextAreaInput from "../form/fields/TextAreaInput";
import Logo from "../Logo";
import PageActions from "../PageActions";
import PageContainer from "../PageContainer";
import PageDescription from "../PageDescription";
import PageTitle from "../PageTitle";

type Props = {
    config: ScreenConfig;
};

function MultiSelectOrWrite({ config }: Props) {
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
                className="flex flex-col"
                onSubmit={screen.onSubmit}
            >
                <CheckboxGroup
                    className="mb-15 justify-start"
                    name={screen.name(Strings.input_1)}
                    optionColors={config.screen.options}
                    options={{
                        key: screen.fieldProp(Strings.input_1, Strings.lookup),
                    }}
                />
                <TextAreaInput
                    name={screen.name(Strings.input_2)}
                    placeholder={screen.fieldProp(Strings.input_2, Strings.placeholder)}
                />
            </Form>
            <PageActions
                isForm
                screen={screen}
            />
        </PageContainer>
    );
}

export default MultiSelectOrWrite;
