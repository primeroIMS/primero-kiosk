import { Strings } from "@/constants";
import useStore from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import AppFlowStore from "@/stores/app-flow";

type Props = {
    className?: string;
    flowID: string;
    imgClassName?: string;
    secondary?: boolean;
    showPictorial?: boolean;
};

function Logo({
    className,
    flowID,
    imgClassName,
    secondary,
    showPictorial = false,
}: Props) {
    const logos = AppFlowStore.getAppFlowByHandle(flowID);

    const kioskName = useStore(Strings.theme, Strings.kioskName);
    const pictorialToShow = Boolean(showPictorial && secondary)
        ? logos?.logo_pictorial_secondary
        : logos?.logo_pictorial;

    return (
        <div className={cn("mb-8", className)}>
            {logos?.logo ? (
                <img
                    alt={Strings.logo}
                    className={imgClassName}
                    src={!showPictorial ? (logos.logo as string) : pictorialToShow}
                />
            ) : (
                <div className="text-5xl font-black">{kioskName}</div>
            )}
        </div>
    );
}

export default Logo;
