import Form from "@/components/form/Form";
import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { ScreenConfig } from "@/type";

import Character from "../Character";
import RadioGroupInput from "../form/fields/RadioGroupInput";
import Logo from "../Logo";
import PageActions from "../PageActions";
import PageContainer from "../PageContainer";
import PageDescription from "../PageDescription";
import PageTitle from "../PageTitle";

type Props = {
    config: ScreenConfig;
};

function SingleSelect({ config }: Props) {
    const screen = useScreen({ config });

    return (
        <PageContainer bgColor={config.screen.bg_color}>
            <Logo
                className="absolute start-5 top-5 size-10"
                flowID={config.appFlow.handle}
                secondary={config.screen.logo_secondary}
                showPictorial
            />
            {!config.screen.character.at_bottom && (
                <Character
                    character_bg_color={config.screen.character.bg_color}
                    character_default_id={config.screen.character.default_id as string}
                    character_lookup_id={config.screen.character.lookup_id as string}
                />
            )}
            <PageTitle
                className="mb-8"
                color={config.screen.title.color}
                text={config.screen.title.text}
            />
            <Form
                allowSkip={config.screen.flow.allow_skip}
                onSubmit={screen.onSubmit}
            >
                <RadioGroupInput
                    name={screen.name(Strings.input_1)}
                    optionColors={config.screen.options}
                    options={{
                        key: screen.fieldProp(Strings.input_1, Strings.lookupID),
                    }}
                    type={screen.fieldProp(Strings.input_1, Strings.type)}
                />
            </Form>
            {config.screen?.description?.text && config.screen.character.at_bottom && (
                <div className="relative mt-30 flex h-25 flex-row md:h-40">
                    <Character
                        character_lookup_id={config.screen.character.lookup_id as string}
                        className="absolute start-12 top-5 size-16 md:start-5 md:top-3"
                    />
                    <div className="absolute start-30 -top-20">
                        <div className="relative">
                            <PageDescription
                                className="
                                  prose max-w-xs rounded-lg rounded-es-none bg-(--bgColor)
                                  p-3 text-start text-sm
                                  md:p-5
                                "
                                html
                                style={{ "--bgColor": "#C0CFFF" } as React.CSSProperties}
                                text={config.screen?.description?.text}
                            />
                            <div
                                className="
                                  absolute start-0 -bottom-7 inline-block h-0 w-0
                                  border-t-32 border-r-40 border-b-0 border-l-0
                                  border-solid border-t-[#C0CFFF] border-r-transparent
                                  border-b-transparent border-l-transparent
                                  rtl:rotate-y-180
                                "
                            ></div>
                        </div>
                    </div>
                </div>
            )}
            <PageActions
                isForm
                screen={screen}
            />
        </PageContainer>
    );
}

export default SingleSelect;
