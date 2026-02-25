import PageTitle from "@/components/PageTitle";
import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { ScreenConfig } from "@/type";

import Logo from "../Logo";
import PageActions from "../PageActions";
import PageContainer from "../PageContainer";
import PageDescription from "../PageDescription";

type Props = {
    config: ScreenConfig;
};

function ComfortingResponse({ config }: Props) {
    const screen = useScreen({ config });

    return (
        <PageContainer bgColor={config.screen.bg_color}>
            <Logo
                className="absolute top-5 left-5 size-10"
                flowID={config.appFlow.handle}
                secondary={config.screen.logo_secondary}
                showPictorial
            />
            <div>
                {config.screen.featured_image && (
                    <img
                        alt={Strings.featuredImageAlt}
                        className="mb-8"
                        src={config.screen.featured_image}
                    />
                )}
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
