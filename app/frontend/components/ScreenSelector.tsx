import { Strings } from "@/constants";
import { Screen } from "@/type";

import LanguageSelect from "./screens/LanguageSelect";
import ResponseGoodBye from "./screens/ResponseGoodBye";
import SingleSelect from "./screens/SingleSelect";
import ComfortingResponse from "./screens/ComfortingResponse";
import CharacterInformation from "./screens/CharacterInformation";
import CharacterWelcome from "./screens/CharacterWelcome";

type Props = { config: Screen };

function ScreenSelector({ config }: Props) {
    switch (config.component) {
        case Strings.languageSelect:
            return <LanguageSelect config={config} />;
        case Strings.responseGoodBye:
            return <ResponseGoodBye config={config} />;
        case Strings.singleSelect:
            return <SingleSelect config={config} />;
        case STRINGS.comfortingResponse:
            return <ComfortingResponse config={config} />;
        case STRINGS.characterInformation:
            return <CharacterInformation config={config} />;
        case STRINGS.characterWelcome:
            return <CharacterWelcome config={config} />;
        default:
            return <div>{Strings.notImplemented}</div>;
    }
}

export default ScreenSelector;
