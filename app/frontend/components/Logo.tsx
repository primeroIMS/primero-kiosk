import { Strings } from "@/constants";
import useStore from "@/hooks/use-store";
import { cn } from "@/lib/utils";

type Props = {
    className?: string;
    secondary?: boolean;
    showPictorial?: boolean;
};

function Logo({ className, secondary, showPictorial = false }: Props) {
    const logo = useStore(Strings.theme, Strings.logo);
    const pictorial = useStore(Strings.theme, Strings.logoPictorial);
    const pictorialSecondary = useStore(Strings.theme, Strings.logoPictorialSecondary);
    const kioskName = useStore(Strings.theme, Strings.kioskName);
    const pictorialToShow = Boolean(showPictorial && secondary)
        ? pictorialSecondary
        : pictorial;

    return (
        <div className={cn("mb-8", className)}>
            {logo ? (
                <img
                    alt={Strings.logo}
                    src={!showPictorial ? (logo as string) : pictorialToShow}
                />
            ) : (
                <div className="text-5xl font-black">{kioskName}</div>
            )}
        </div>
    );
}

export default Logo;
