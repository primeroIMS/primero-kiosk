import useOptions from "./use-options";
import useStore from "./use-store";

function useCharacter(character_lookup_id?: string, character_default_id?: string) {
    const character = useStore("form", "kiosk.character");
    const characterIcon = useOptions({
        key: character_lookup_id as string,
    });

    const selectedCharacter = characterIcon?.find(
        (option) => option.value === (character?.name || character_default_id),
    );

    return [selectedCharacter?.icon, selectedCharacter?.label];
}

export default useCharacter;
