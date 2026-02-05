import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { Screen } from "@/type";

import CarouselInput from "../form/fields/CarouselInput";
import Form from "../form/Form";
import PageActions from "../PageActions";
import PageTitle from "../PageTitle";

type Props = {
    config: Screen;
};

function CharacterSelection({ config }: Props) {
    const screen = useScreen({ config });

    return (
        <>
            <PageTitle
                color={config.title.color}
                text={config.title.text}
            />
            <Form
                className="mb-20"
                debug
                onSubmit={screen.onSubmit}
            >
                <CarouselInput
                    name={screen.name(Strings.input_1, Strings.character)}
                    options={{
                        key: screen.fieldProp(Strings.input_1, Strings.lookup),
                    }}
                />
            </Form>
            <PageActions
                isForm
                screen={screen}
            />
        </>
    );
}

export default CharacterSelection;
