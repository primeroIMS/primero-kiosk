import Form from "@/components/form/Form";
import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { type Screen } from "@/type";

import RadioGroupInput from "../form/fields/RadioGroupInput";
import TextAreaInput from "../form/fields/TextAreaInput";
import PageActions from "../PageActions";
import PageTitle from "../PageTitle";

type Props = {
    config: Screen;
};

function SelectWithTextArea({ config }: Props) {
    const screen = useScreen({
        config,
        onSubmit: (data) => {},
    });

    return (
        <>
            <PageTitle
                color={config.title.color}
                text={config.title.text}
            />
            <Form
                className="flex flex-col gap-15"
                debug
                onSubmit={screen.onSubmit}
            >
                <RadioGroupInput
                    className="justify-start"
                    name={screen.name(Strings.input_1)}
                    options={{
                        key: screen.fieldProp(Strings.input_1, Strings.lookup),
                    }}
                />
                <TextAreaInput
                    name={screen.name(Strings.input_2)}
                    placeholder={screen.fieldProp(Strings.input_1, Strings.placeholder)}
                />
            </Form>
            <PageActions screen={screen} />
        </>
    );
}

export default SelectWithTextArea;
