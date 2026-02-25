import PageTitle from "@/components/PageTitle";
import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { ScreenConfig } from "@/type";

import Character from "../Character";
import Logo from "../Logo";
import PageActions from "../PageActions";
import PageContainer from "../PageContainer";
import PageDescription from "../PageDescription";

type Props = {
    config: ScreenConfig;
};

function ComfortingResponse({ config }: Props) {
    const screen = useScreen({ config });
    console.log(config.screen);
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
            <div className="mb-25">
                <div className="relative mx-auto aspect-square w-50">
                    {config.screen.featured_image && (
                        <img
                            alt={Strings.featuredImageAlt}
                            className="mb-8 w-50"
                            src={config.screen.featured_image}
                        />
                    )}
                    <Character
                        character_lookup_id={config.screen.character_lookup_id as string}
                        className="absolute bottom-0 size-50! bg-transparent"
                    />
                </div>
                <PageTitle
                    color={config.screen.title.color}
                    text={config.screen.title.text}
                />
                <PageDescription
                    className="text-center text-lg whitespace-pre-line text-foreground"
                    color={config.screen.description?.color}
                    text={config.screen.description?.text}
                />
            </div>
            <PageActions screen={screen} />
        </PageContainer>
    );
}

export default ComfortingResponse;
