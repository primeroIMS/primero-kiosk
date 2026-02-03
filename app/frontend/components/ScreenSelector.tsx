import { STRINGS } from "@/constants";
import { Screen } from "@/type";

import LanguageSelect from "./screens/LanguageSelect";
import ResponseGoodBye from "./screens/ResponseGoodBye";
import SingleSelect from "./screens/SingleSelect";
import ComfortingResponse from "./screens/ComfortingResponse";

type Props = { config: Screen };

function ScreenSelector({ config }: Props) {
    switch (config.component) {
        case STRINGS.languageSelect:
            return <LanguageSelect config={config} />;
        case STRINGS.responseGoodBye:
            return <ResponseGoodBye config={config} />;
        case STRINGS.singleSelect:
            return <SingleSelect config={config} />;
        case STRINGS.comfortingResponse:
            return <ComfortingResponse config={config} />;
        default:
            return <div>{STRINGS.notImplemented}</div>;
    }
}

export default ScreenSelector;
