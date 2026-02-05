import PageTitle from "@/components/PageTitle";
import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { Screen } from "@/type";

import I18nText from "../I18nText";
import PageActions from "../PageActions";

type Props = {
    config: Screen;
};

function ResponseGoodBye({ config }: Props) {
    const screen = useScreen({
        config,
    });

    return (
        <>
            <img
                alt={Strings.featuredImage}
                className="mb-8"
                src={config.featured_image as string}
            />
            <PageTitle color={config.title.color}>
                <I18nText text={config.title.text} />
            </PageTitle>
            <p
                className="mb-20 text-lg"
                style={{ color: config.description?.color }}
            >
                <I18nText text={config.description?.text} />
            </p>
            <PageActions screen={screen} />
        </>
    );
}

export default ResponseGoodBye;
