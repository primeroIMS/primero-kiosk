import { Strings } from "@/constants";
import { Screen } from "@/type";

import CharacterInformation from "./screens/CharacterInformation";
import CharacterWelcome from "./screens/CharacterWelcome";
import ComfortingResponse from "./screens/ComfortingResponse";
import LanguageSelect from "./screens/LanguageSelect";
import ResponseGoodBye from "./screens/ResponseGoodBye";
import SingleSelect from "./screens/SingleSelect";

type Props = { config: Screen };

function ScreenSelector({ config }: Props) {
    switch (config.component) {
        case Strings.characterInformation:
            return <CharacterInformation config={config} />;
        case Strings.characterWelcome:
            return <CharacterWelcome config={config} />;
        case Strings.comfortingResponse:
            return <ComfortingResponse config={config} />;
        case Strings.languageSelect:
            return <LanguageSelect config={config} />;
        case Strings.responseGoodBye:
            return <ResponseGoodBye config={config} />;
        case Strings.singleSelect:
            return <SingleSelect config={config} />;
        default:
            return <div>{Strings.notImplemented}</div>;
    }
}

export default ScreenSelector;
