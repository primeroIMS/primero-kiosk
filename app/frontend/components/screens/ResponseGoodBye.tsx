import Button from "@/components/Button";
import PageTitle from "@/components/PageTitle";
import useStore from "@/hooks/use-store";
import i18n from "@/translations";
import { Screen } from "@/type";

type Props = {
    config: Screen;
};

function ResponseGoodBye({ config }: Props) {
    const hero = useStore("theme", "theme.response_hero");

    return (
        <>
            <img
                alt="Response Hero"
                className="mb-8"
                src={hero as string}
            />
            <PageTitle color={config.title.color}>
                {config.title.text_i18n[i18n.locale]}
            </PageTitle>
            <p
                className="mb-20 text-lg"
                style={{ color: config.description?.color }}
            >
                {config.description?.text_i18n?.[i18n.locale]}
            </p>
            <Button
                className="bg-blue border-2 text-white"
                text="button.restart"
                to="/"
                variant="outline"
            >
                {config.flow.label_i18n[i18n.locale]}
            </Button>
        </>
    );
}

export default ResponseGoodBye;
