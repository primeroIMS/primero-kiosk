import Form from "@/components/form/Form";
import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { type Screen } from "@/type";

import CheckboxGroup from "../form/fields/CheckboxGroup";
import TextAreaInput from "../form/fields/TextAreaInput";
import PageActions from "../PageActions";
import PageDescription from "../PageDescription";
import PageTitle from "../PageTitle";

type Props = {
    config: Screen;
};

function MultiSelect({ config }: Props) {
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
            <PageDescription
                color={config.description?.color}
                text={config.description?.text}
            />
            <Form
                className="flex flex-col gap-15"
                onSubmit={screen.onSubmit}
            >
                <CheckboxGroup
                    className="justify-start"
                    name={screen.name(Strings.input_1)}
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
        </>
    );
}

export default MultiSelect;
