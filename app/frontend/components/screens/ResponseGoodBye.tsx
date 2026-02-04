import Button from "@/components/Button";
import PageTitle from "@/components/PageTitle";
import { STRINGS } from "@/constants";
import { Screen } from "@/type";

import I18nText from "../I18nText";

type Props = {
    config: Screen;
};

function ResponseGoodBye({ config }: Props) {
    return (
        <>
            <img
                alt={STRINGS.featuredImage}
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
            <Button
                className="bg-blue border-2 text-white"
                text="button.restart"
                to="/"
                variant="outline"
            >
                <I18nText
                    fallback="buttons.continue"
                    text={config.flow?.label_next}
                />
            </Button>
        </>
    );
}

export default ResponseGoodBye;
