import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { type Screen } from "@/type";

import RadioGroupInput from "../form/fields/RadioGroupInput";
import Form from "../form/Form";
import Logo from "../Logo";
import PageActions from "../PageActions";
import PageTitle from "../PageTitle";

type Props = {
    config: Screen;
};

function Hub({ config }: Props) {
    const screen = useScreen({ config });

    return (
        <>
            <Logo
                className="absolute top-5 left-5 size-10"
                secondary={config.logo_secondary}
                showPictorial
            />
            <Form
                allowSkip={config.flow.allow_skip}
                onSubmit={screen.onSubmit}
            >
                <RadioGroupInput
                    centerText
                    className="w-full"
                    cols={2}
                    iconLarge
                    name={screen.name(Strings.input_1)}
                    optionColors={config.options}
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
