import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { type Screen } from "@/type";

import RadioGroupInput from "../form/fields/RadioGroupInput";
import Form from "../form/Form";
import PageActions from "../PageActions";
import PageTitle from "../PageTitle";

type Props = {
    config: Screen;
};

function Hub({ config }: Props) {
    const screen = useScreen({ config });

    return (
        <>
            <Form onSubmit={screen.onSubmit}>
                <RadioGroupInput
                    centerText
                    className="w-full"
                    cols={2}
                    iconLarge
                    name={screen.name(Strings.input_1)}
                    options={{
                        key: screen.fieldProp(Strings.input_1, Strings.lookup),
                    }}
                >
                    <div className="aspect-square min-w-40">
                        <PageTitle
                            className="text-left"
                            color={config.title.color}
                            text={config.title.text}
                        />
                    </div>
                </RadioGroupInput>
            </Form>
            <PageActions
                isForm
                screen={screen}
            />
        </>
    );
}

export default Hub;
