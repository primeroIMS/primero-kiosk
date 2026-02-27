import isEmpty from "lodash-es/isEmpty";

import { cn } from "@/lib/utils";
import { I18nTranslation } from "@/type";

import Text from "./Text";

type Props = {
    className?: string;
    color?: string;
    fallback?: string;
    html?: boolean;
    style?: React.CSSProperties;
    text?: I18nTranslation | string;
    translate?: boolean;
};

function PageDescription({
    className,
    color,
    fallback,
    html,
    style,
    text,
    translate = true,
}: Props) {
    if (isEmpty(text)) return null;

    return (
        <p
            className={cn(
                "mb-5 w-full text-center clamp-[text,sm,lg,@sm,@5xl]",
                className,
            )}
            style={{ color, ...style }}
        >
            <Text
                fallback={fallback}
                html={html}
                text={text}
                translate={translate}
            />
        </p>
    );
}

export default PageDescription;
