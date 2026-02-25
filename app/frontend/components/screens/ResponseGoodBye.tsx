import { useEffect } from "react";

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

function ResponseGoodBye({ config }: Props) {
    const screen = useScreen({
        config,
    });

    useEffect(() => {
        screen.submitToRemote();
    }, [screen]);

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
            <div className="mb-8 w-full">
                <img
                    alt={Strings.featuredImage}
                    className="mx-auto clamp-[w,50,90,@sm,@5xl]"
                    src={config.screen.featured_image as string}
                />
            </div>
            <PageTitle
                color={config.screen.title.color}
                text={config.screen.title.text}
            />
            <PageDescription
                color={config.screen.description?.color}
                text={config.screen.description?.text}
            />
            <PageActions screen={screen} />
        </PageContainer>
    );
}

export default ResponseGoodBye;
