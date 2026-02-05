import { Strings } from "@/constants";
import useScreen from "@/hooks/use-screen";
import { Screen } from "@/type";

import PageActions from "../PageActions";
import PageDescription from "../PageDescription";
import PageTitle from "../PageTitle";

type Props = {
    config: Screen;
};

function CharacterWelcome({ config }: Props) {
    const screen = useScreen({ config });

    return (
        <>
            <div className="mb-5 rounded-lg bg-cyan-500 p-5 pr-30">
                <div className="mb-5 rounded-lg bg-white p-5">
                    <PageTitle
                        className="mb-5 text-left text-2xl font-bold text-foreground"
                        color={config?.title?.color}
                        text={config.title.text}
                    />
                    <PageDescription
                        className="text-left text-lg whitespace-pre-line text-foreground"
                        color={config?.description?.color}
                        text={config.description?.text}
                    />
                </div>
                <div className="mb-20">
                    {config.featured_image && (
                        <img
                            alt={Strings.featuredImageAlt}
                            className="mb-8 rounded-full object-cover"
                            src={config.featured_image}
                            width={150}
                        />
                    )}
                </div>
            </div>
            <PageActions screen={screen} />
        </>
    );
}

export default CharacterWelcome;
