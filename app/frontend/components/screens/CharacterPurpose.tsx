import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { ScreenConfig } from "@/type";

import Character from "../Character";
import Logo from "../Logo";
import PageActions from "../PageActions";
import PageContainer from "../PageContainer";
import PageDescription from "../PageDescription";
import PageTitle from "../PageTitle";

type Props = {
    config: ScreenConfig;
};

function CharacterPurpose({ config }: Props) {
    const screen = useScreen({ config });

    return (
        <PageContainer bgColor={config.screen.bg_color}>
            <Logo
                className="absolute start-5 top-5 size-10"
                flowID={config.appFlow.handle}
                secondary={config.screen.logo_secondary}
                showPictorial
            />
            <div className="mb-8 flex w-full justify-center">
                <img
                    alt={Strings.featuredImage}
                    className="max-w-2xs"
                    src={config.screen.featured_image as string}
                />
            </div>
            <PageTitle
                className="mb-8"
                color={config.screen.title.color}
                text={config.screen.title.text}
            />
            {config.screen?.description?.text && config.screen.character.at_bottom && (
                <div className="relative mt-30 flex h-40 flex-row">
                    <Character
                        character_default_id={
                            config.screen.character.default_id as string
                        }
                        character_lookup_id={config.screen.character.lookup_id as string}
                        className="absolute start-5 top-3 size-16"
                    />
                    <div className="absolute start-30 -top-20">
                        <div className="relative">
                            <PageDescription
                                className="
                                  prose max-w-xs rounded-lg rounded-bl-none bg-(--bgColor)
                                  p-5 text-start text-sm
                                "
                                html
                                style={{ "--bgColor": "#FFFFFF" } as React.CSSProperties}
                                text={config.screen?.description?.text}
                            />
                            <div
                                className="
                                  absolute start-0 -bottom-7 inline-block h-0 w-0
                                  border-t-32 border-r-40 border-b-0 border-l-0
                                  border-solid border-t-[#FFFFFF] border-r-transparent
                                  border-b-transparent border-l-transparent
                                "
                            ></div>
                        </div>
                    </div>
                </div>
            )}
            <PageActions screen={screen} />
        </PageContainer>
    );
}

export default CharacterPurpose;
