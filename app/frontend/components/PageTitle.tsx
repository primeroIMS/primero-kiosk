import isEmpty from "lodash-es/isEmpty";

import { cn } from "@/lib/utils";
import { I18nTranslation } from "@/type";

import Text from "./Text";

type Props = {
    className?: string;
    color?: string;
    fallback?: string;
    text: I18nTranslation | string;
    translate?: boolean;
};

function PageTitle({ className, color, fallback, text, translate = true }: Props) {
    if (isEmpty(text)) return null;

    return (
        <h1
            className={cn(
                `
                  mb-3 w-full text-center clamp-[text,base,2xl,@sm,@5xl] font-bold
                  text-balance
                `,
                className,
            )}
            style={{ color }}
        >
            <Text
                fallback={fallback}
                text={text}
                translate={translate}
            />
        </h1>
    );
}

export default PageTitle;
