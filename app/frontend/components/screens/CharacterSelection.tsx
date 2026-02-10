import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { Screen } from "@/type";

import CarouselInput from "../form/fields/CarouselInput";
import Form from "../form/Form";
import Logo from "../Logo";
import PageActions from "../PageActions";
import PageContainer from "../PageContainer";
import PageDescription from "../PageDescription";
import PageTitle from "../PageTitle";

type Props = {
    config: Screen;
};

function CharacterSelection({ config }: Props) {
    const screen = useScreen({ config });

    return (
        <PageContainer
            bgColor={config.bg_color}
            centered
        >
            <Logo
                className="absolute top-5 left-5 size-10"
                secondary={config.logo_secondary}
                showPictorial
            />
            <PageTitle
                color={config.title.color}
                text={config.title.text}
            />
            <PageDescription
                color={config.description?.color}
                text={config.description?.text}
            />
            <Form
                allowSkip={config.flow.allow_skip}
                onSubmit={screen.onSubmit}
            >
                <CarouselInput
                    iconName={screen.name(Strings.input_1, Strings.characterIcon)}
                    name={screen.name(Strings.input_1, Strings.character)}
                    optionColors={config.options}
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

export default CharacterSelection;
