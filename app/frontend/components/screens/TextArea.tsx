import Form from "@/components/form/Form";
import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { type Screen } from "@/type";

import TextAreaInput from "../form/fields/TextAreaInput";
import Logo from "../Logo";
import PageActions from "../PageActions";
import PageTitle from "../PageTitle";

type Props = {
    config: Screen;
};

function TextArea({ config }: Props) {
    const screen = useScreen({
        config,
        onSubmit: (data) => {},
    });

    return (
        <>
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
                onSubmit={screen.onSubmit}
            >
                <TextAreaInput
                    name={screen.name(Strings.input_1)}
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

export default TextArea;
