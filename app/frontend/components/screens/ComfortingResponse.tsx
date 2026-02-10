import PageTitle from "@/components/PageTitle";
import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { Screen } from "@/type";

import Logo from "../Logo";
import PageActions from "../PageActions";
import PageContainer from "../PageContainer";
import PageDescription from "../PageDescription";

type Props = {
    config: Screen;
};

function ComfortingResponse({ config }: Props) {
    const screen = useScreen({ config });

    return (
        <PageContainer bgColor={config.bg_color}>
            <Logo
                className="absolute top-5 left-5 size-10"
                secondary={config.logo_secondary}
                showPictorial
            />
            <div>
                {config.featured_image && (
                    <img
                        alt={Strings.featuredImageAlt}
                        className="mb-8"
                        src={config.featured_image}
                    />
                )}
                <PageTitle
                    color={config.title.color}
                    text={config.title.text}
                />
                <PageDescription
                    className="text-center text-lg whitespace-pre-line text-foreground"
                    color={config?.description?.color}
                    text={config.description?.text}
                />
            </div>
            <PageActions screen={screen} />
        </PageContainer>
    );
}

export default ComfortingResponse;
