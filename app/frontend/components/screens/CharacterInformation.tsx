import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { ScreenConfig } from "@/type";

import Logo from "../Logo";
import PageActions from "../PageActions";
import PageContainer from "../PageContainer";
import PageDescription from "../PageDescription";
import PageTitle from "../PageTitle";

type Props = {
    config: ScreenConfig;
};

function CharacterResponse({ config }: Props) {
    const screen = useScreen({ config });

    return (
        <PageContainer bgColor={config.screen?.bg_color}>
            <Logo
                className="absolute top-5 left-5 size-10"
                flowID={config.appFlow.handle}
                secondary={config.screen?.logo_secondary}
                showPictorial
            />
            <div className="mb-10 rounded-lg bg-white p-5">
                <PageTitle
                    className="mb-5 text-center font-bold text-foreground"
                    text={config.screen?.title.text}
                />
                <PageDescription
                    className="text-center whitespace-pre-line text-foreground"
                    text={config.screen?.description?.text}
                />
            </div>
            <div className="mb-20">
                {config.screen?.featured_image && (
                    <img
                        alt={Strings.featuredImageAlt}
                        className="mb-8 object-cover"
                        src={config.screen?.featured_image}
                        width={150}
                    />
                )}
            </div>
            <PageActions screen={screen} />
        </PageContainer>
    );
}

export default CharacterResponse;
