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

function ResponseGoodBye({ config }: Props) {
    const screen = useScreen({
        config,
    });

    return (
        <PageContainer
            bgColor={config.bg_color}
            centered
        >
            <Logo
                className="absolute top-5 left-5 size-10"
                secondary={config.logo_secondary}
                showPictorial
            />
            <div className="mb-8 w-full">
                <img
                    alt={Strings.featuredImage}
                    className="mx-auto clamp-[w,50,90,@sm,@5xl]"
                    src={config.featured_image as string}
                />
            </div>
            <PageTitle
                color={config.title.color}
                text={config.title.text}
            />
            <PageDescription
                color={config.description?.color}
                text={config.description?.text}
            />
            <PageActions screen={screen} />
        </PageContainer>
    );
}

export default ResponseGoodBye;
