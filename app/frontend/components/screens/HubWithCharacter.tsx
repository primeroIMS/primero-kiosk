import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import useStore from "@/hooks/use-store";
import i18n from "@/translations";
import { type Screen } from "@/type";

import RadioGroupInput from "../form/fields/RadioGroupInput";
import Form from "../form/Form";
import Icon from "../Icon";
import Logo from "../Logo";
import PageActions from "../PageActions";
import PageContainer from "../PageContainer";
import PageDescription from "../PageDescription";
import PageTitle from "../PageTitle";

type Props = {
    config: Screen;
};

function HubWithCharacter({ config }: Props) {
    const screen = useScreen({ config });
    const character = useStore("form", "global.character");

    return (
        <PageContainer bgColor={config.bg_color}>
            <Logo
                className="absolute top-5 left-5 size-10"
                secondary={config.logo_secondary}
                showPictorial
            />
            <div className="mb-10 flex w-full justify-center">
                <div
                    className="
                      flex clamp-[size,30,40,@sm,@5xl] overflow-hidden rounded-full
                      bg-amber-100
                    "
                >
                    <Icon src={character?.icon} />
                </div>
            </div>
            <PageTitle
                color={config.title.color}
                text={config.title.text}
            />
            <PageDescription
                color={config.description?.color}
                text={config.description?.text}
            />
            <div
                className="
                  my-5 flex items-center py-3 text-lg font-light text-white
                  before:me-6 before:flex-1 before:border-t before:border-white
                  after:ms-6 after:flex-1 after:border-t after:border-white
                "
            >
                {i18n.t("divider.pick_one")}
            </div>
            <Form
                allowSkip={config.flow.allow_skip}
                onSubmit={screen.onSubmit}
            >
                <RadioGroupInput
                    centerText
                    cols={2}
                    iconLarge
                    name={screen.name(Strings.input_1)}
                    optionColors={config.options}
                    options={{
                        key: screen.fieldProp(Strings.input_1, Strings.lookup),
                    }}
                    outlined
                />
            </Form>
            <PageActions
                isForm
                screen={screen}
            />
        </PageContainer>
    );
}

export default HubWithCharacter;
