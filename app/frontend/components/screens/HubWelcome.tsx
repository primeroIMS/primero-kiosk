import { Strings } from "@/constants";
import useCharacter from "@/hooks/use-character";
import useOptions from "@/hooks/use-options";
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

function HubWelcome({ config }: Props) {
    const screen = useScreen({ config });
    const hub = useStore("form", "kiosk.hub");
    const [character] = useCharacter(config.screen.character_lookup_id);
    const hubOptions = useOptions({
        key: "hub",
    });
    const hubIcon = hubOptions?.find((option) => option.value === hub)?.icon;

    return (
        <PageContainer
            bgColor={config.screen.bg_color}
            centered
        >
            <Logo
                className="absolute start-5 top-5 size-10"
                flowID={config.appFlow.handle}
                secondary={config.screen.logo_secondary}
                showPictorial
            />
            <div className="w-full">
                <div className="relative mx-auto -mb-8 flex w-2/4 flex-col items-center">
                    <img
                        className="size-20 rtl:rotate-y-180"
                        src={hubIcon}
                    />
                    <PageTitle
                        className="w-35 text-center text-2xl font-bold text-foreground"
                        color={config.screen?.title?.color}
                        text={config.screen.title.text}
                    />
                    <div className="">
                        <img
                            alt={Strings.featuredImageAlt}
                            className="w-45 md:w-60 rtl:rotate-y-180"
                            src={character}
                        />
                    </div>
                </div>
            </div>
            <div className="relative mb-5 w-full rounded-lg p-4 text-foreground">
                <svg
                    className="absolute end-30 -top-3 h-10 w-10 rtl:rotate-y-180"
                    fill="none"
                    viewBox="0 0 59 44"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 3.26217e-06L2.26731e-06 44L59 44L0 3.26217e-06Z"
                        fill="#FEFEF1"
                    />
                </svg>
                <div className="w-full rounded-lg bg-white p-5">
                    <PageDescription
                        className="text-start whitespace-pre-line text-foreground"
                        html
                        text={config.screen?.description?.text}
                    />
                </div>
            </div>
            <PageActions screen={screen} />
        </PageContainer>
    );
}

export default HubWelcome;
