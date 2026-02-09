import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { Screen } from "@/type";

import Logo from "../Logo";
import PageActions from "../PageActions";
import PageDescription from "../PageDescription";
import PageTitle from "../PageTitle";

type Props = {
    config: Screen;
};

function CharacterResponse({ config }: Props) {
    const screen = useScreen({ config });

    return (
        <>
            <Logo
                className="absolute top-5 left-5 size-10"
                secondary={config.logo_secondary}
                showPictorial
            />
            <div className="mb-10 rounded-lg bg-white p-5">
                <PageTitle
                    className="mb-5 text-center font-bold text-foreground"
                    text={config.title.text}
                />
                <PageDescription
                    className="text-center whitespace-pre-line text-foreground"
                    text={config.description?.text}
                />
            </div>
            <div className="mb-20">
                {config.featured_image && (
                    <img
                        alt={Strings.featuredImageAlt}
                        className="mb-8 object-cover"
                        src={config.featured_image}
                        width={150}
                    />
                )}
            </div>
            <PageActions screen={screen} />
        </>
    );
}

export default CharacterResponse;
