import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { ScreenConfig } from "@/type";

import RadioGroupInput from "../form/fields/RadioGroupInput";
import Form from "../form/Form";
import Logo from "../Logo";
import PageActions from "../PageActions";
import PageContainer from "../PageContainer";
import PageTitle from "../PageTitle";

type Props = {
    config: ScreenConfig;
};

function Hub({ config }: Props) {
    const screen = useScreen({ config });

    return (
        <PageContainer bgColor={config.screen.bg_color}>
            <Logo
                className="absolute start-5 top-5 size-10"
                flowID={config.appFlow.handle}
                secondary={config.screen.logo_secondary}
                showPictorial
            />
            <Form
                allowSkip={config.screen.flow.allow_skip}
                onSubmit={screen.onSubmit}
            >
                <RadioGroupInput
                    centerText
                    className="w-full"
                    cols={2}
                    iconLarge
                    name={screen.name(Strings.input_1)}
                    optionColors={config.screen.options}
                    options={{
                        key: screen.fieldProp(Strings.input_1, Strings.lookupID),
                    }}
                >
                    <div className="aspect-square min-w-40">
                        <PageTitle
                            className="text-start"
                            color={config.screen.title.color}
                            text={config.screen.title.text}
                        />
                    </div>
                </RadioGroupInput>
            </Form>
            <PageActions
                isForm
                screen={screen}
            />
        </PageContainer>
    );
}

export default Hub;
