import { Strings } from "@/constants";
import useStore from "@/hooks/use-store";
import { cn } from "@/lib/utils";

type Props = {
    className?: string;
};

function Logo({ className }: Props) {
    const logo = useStore(Strings.theme, Strings.logo);
    const kioskName = useStore(Strings.theme, Strings.kioskName);

    return (
        <div className={cn("mb-8", className)}>
            {logo ? (
                <img
                    alt={Strings.logo}
                    src={logo as string}
                />
            ) : (
                <div className="text-5xl font-black">{kioskName}</div>
            )}
        </div>
    );
}

export default Logo;
