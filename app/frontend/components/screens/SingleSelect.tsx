import Form from "@/components/form/Form";
import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { ScreenConfig } from "@/type";

import RadioGroupInput from "../form/fields/RadioGroupInput";
import Logo from "../Logo";
import PageActions from "../PageActions";
import PageContainer from "../PageContainer";
import PageTitle from "../PageTitle";

type Props = {
    config: ScreenConfig;
};

function SingleSelect({ config }: Props) {
    const screen = useScreen({
        config,
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
                className="mb-8"
                color={config.screen.title.color}
                text={config.screen.title.text}
            />
            <Form
                allowSkip={config.screen.flow.allow_skip}
                debug
                onSubmit={screen.onSubmit}
            >
                <RadioGroupInput
                    cols={3}
                    name={screen.name(Strings.input_1)}
                    optionColors={config.screen.options}
                    options={{
                        key: screen.fieldProp(Strings.input_1, Strings.lookup),
                    }}
                />
            </Form>
            <PageActions
                isForm
                screen={screen}
            />
        </PageContainer>
    );
}

export default SingleSelect;
