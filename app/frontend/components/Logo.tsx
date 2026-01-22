import useStore from "@/hooks/use-store";
import { cn } from "@/lib/utils";

type Props = {
    className?: string;
};

function Logo({ className }: Props) {
    const logo = useStore("theme", "theme.logo");
    const kioskName = useStore("theme", "theme.kiosk_name");

    return (
        <div className={cn("mb-8", className)}>
            {logo ? (
                <img
                    alt="Logo"
                    className="h-15"
                    src={logo as string}
                />
            ) : (
                <div className="text-5xl font-black">{kioskName}</div>
            )}
        </div>
    );
}

export default Logo;
