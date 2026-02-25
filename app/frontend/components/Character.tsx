import useCharacter from "@/hooks/use-character";
import { cn } from "@/lib/utils";

import Icon from "./Icon";

type Props = {
    character_lookup_id: string;
    className?: string;
};

function Character({ character_lookup_id, className }: Props) {
    const [icon] = useCharacter(character_lookup_id);

    if (!icon) {
        return null;
    }

    return (
        <div
            className={cn(
                `
                  relative mx-auto mb-8 flex clamp-[size,20,30,@sm,@5xl] overflow-hidden
                  rounded-full bg-white
                `,
                className,
            )}
        >
            <Icon
                className="absolute bottom-0 aspect-square object-cover"
                src={icon as string}
            />
        </div>
    );
}

export default Character;
