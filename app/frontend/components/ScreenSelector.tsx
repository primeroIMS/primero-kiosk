import { Strings } from "@/constants";
import { Screen } from "@/type";

import CharacterInformation from "./screens/CharacterInformation";
import CharacterSelection from "./screens/CharacterSelection";
import CharacterWelcome from "./screens/CharacterWelcome";
import ComfortingResponse from "./screens/ComfortingResponse";
import LanguageSelect from "./screens/LanguageSelect";
import MultiSelect from "./screens/MultiSelect";
import ResponseGoodBye from "./screens/ResponseGoodBye";
import SelectWithTextArea from "./screens/SelectWithTextArea";
import SingleSelect from "./screens/SingleSelect";
import TextArea from "./screens/TextArea";

type Props = { config: Screen };

function ScreenSelector({ config }: Props) {
    switch (config.component) {
        case Strings.characterInformation:
            return <CharacterInformation config={config} />;
        case Strings.characterSelection:
            return <CharacterSelection config={config} />;
        case Strings.characterWelcome:
            return <CharacterWelcome config={config} />;
        case Strings.comfortingResponse:
            return <ComfortingResponse config={config} />;
        case Strings.languageSelect:
            return <LanguageSelect config={config} />;
        case Strings.multiSelect:
            return <MultiSelect config={config} />;
        case Strings.responseGoodBye:
            return <ResponseGoodBye config={config} />;
        case Strings.selectWithTextArea:
            return <SelectWithTextArea config={config} />;
        case Strings.singleSelect:
            return <SingleSelect config={config} />;
        case Strings.textArea:
            return <TextArea config={config} />;
        default:
            return <div>{Strings.notImplemented}</div>;
    }
}

export default ScreenSelector;
