import Form from "@/components/form/Form";
import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { type Screen } from "@/type";

import RadioGroupInput from "../form/fields/RadioGroupInput";
import TextAreaInput from "../form/fields/TextAreaInput";
import Logo from "../Logo";
import PageActions from "../PageActions";
import PageContainer from "../PageContainer";
import PageTitle from "../PageTitle";

type Props = {
    config: Screen;
};

function SelectOrWrite({ config }: Props) {
    const screen = useScreen({
        config,
        onSubmit: (data) => {},
    });

    return (
        <PageContainer bgColor={config.bg_color}>
            <Logo
                className="absolute top-5 left-5 size-10"
                secondary={config.logo_secondary}
                showPictorial
            />
            <PageTitle
                color={config.title.color}
                text={config.title.text}
            />
            <Form
                allowSkip={config.flow.allow_skip}
                className="flex flex-col gap-10"
                onSubmit={screen.onSubmit}
            >
                <RadioGroupInput
                    className="justify-start"
                    name={screen.name(Strings.input_1)}
                    optionColors={config.options}
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

export default SelectOrWrite;
