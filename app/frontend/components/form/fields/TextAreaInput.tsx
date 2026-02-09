import { useController } from "react-hook-form";

import i18n, { I18nLocale } from "@/translations";
import { I18nTranslation } from "@/type";

type Props = {
    name: string;
    placeholder?: I18nTranslation;
    showIcon?: boolean;
};

function TextAreaInput({ name, placeholder, showIcon = true }: Props) {
    const { field } = useController({
        defaultValue: "",
        name,
    });

    return (
        <div className="relative">
            {showIcon && (
                <div
                    className="
                      absolute -top-5 -left-5 flex size-15 items-center justify-center
                      rounded-full bg-white text-center shadow-sm
                    "
                >
                    <span className="text-2xl">✏️</span>
                </div>
            )}
            <textarea
                className="
                  no-resize scrollbar-thumb-rounded scrollbar-thin w-full resize-none
                  rounded-xl bg-white/80 p-10 text-lg scrollbar-thumb-neutral-800
                  scrollbar-track-transparent
                  focus:bg-white
                "
                onChange={field.onChange}
                placeholder={placeholder?.[i18n.locale as I18nLocale]}
                rows={5}
                value={field.value}
            />
        </div>
    );
}

export default TextAreaInput;
