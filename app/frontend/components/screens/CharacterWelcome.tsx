import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import useStore from "@/hooks/use-store";
import { ScreenConfig } from "@/type";

import Logo from "../Logo";
import PageActions from "../PageActions";
import PageContainer from "../PageContainer";
import PageDescription from "../PageDescription";
import PageTitle from "../PageTitle";

type Props = {
    config: ScreenConfig;
};

function CharacterWelcome({ config }: Props) {
    const screen = useScreen({ config });
    const character = useStore("form", "kiosk.character");

    return (
        <PageContainer
            bgColor={config.screen.bg_color}
            centered
        >
            <Logo
                className="absolute top-5 left-5 size-10"
                flowID={config.appFlow.handle}
                secondary={config.screen.logo_secondary}
                showPictorial
            />
            <div
                className="relative mb-5 h-90 rounded-lg p-4 pr-40"
                style={{ backgroundColor: config.screen?.options.bg_color }}
            >
                <div className="absolute top-4 left-5 z-50 w-3/5 rounded-lg bg-white p-5">
                    <PageTitle
                        className="mb-5 text-left font-bold text-foreground"
                        color={config.screen?.title?.color}
                        text={config.screen.title.text}
                    />
                    <PageDescription
                        className="text-left whitespace-pre-line text-foreground"
                        color={config.screen?.description?.color}
                        text={config.screen?.description?.text}
                    />
                </div>
                <div className="absolute right-0 bottom-0 z-10">
                    <img
                        alt={Strings.featuredImageAlt}
                        className="w-45 md:w-60"
                        src={character?.icon}
                    />
                </div>
            </div>
            <PageActions screen={screen} />
        </PageContainer>
    );
}

export default CharacterWelcome;
