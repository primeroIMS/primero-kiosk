import Form from "@/components/form/Form";
import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { type Screen } from "@/type";

import RadioGroupInput from "../form/fields/RadioGroupInput";
import PageActions from "../PageActions";
import PageTitle from "../PageTitle";

type Props = {
    config: Screen;
};

function SingleSelect({ config }: Props) {
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
            <Form onSubmit={screen.onSubmit}>
                <RadioGroupInput
                    name={screen.name(Strings.input_1)}
                    options={{
                        key: screen.fieldProp(Strings.input_1, Strings.lookup),
                    }}
                />
            </Form>
            <PageActions screen={screen} />
        </>
    );
}

export default SingleSelect;
