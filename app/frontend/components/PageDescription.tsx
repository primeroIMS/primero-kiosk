import isEmpty from "lodash-es/isEmpty";

import { cn } from "@/lib/utils";
import { I18nTranslation } from "@/type";

import Text from "./Text";

type Props = {
    className?: string;
    color?: string;
    fallback?: string;
    text?: I18nTranslation | string;
    translate?: boolean;
};

function PageDescription({ className, color, fallback, text, translate = true }: Props) {
    if (isEmpty(text)) return null;

    return (
        <p
            className={cn("mb-10 w-full text-center text-3xl font-bold", className)}
            style={{ color }}
        >
            <Text
                fallback={fallback}
                text={text}
                translate={translate}
            />
        </p>
    );
}

export default PageDescription;
