import { useController } from "react-hook-form";

import i18n, { I18nLocale } from "@/translations";
import { I18nTranslation } from "@/type";

type Props = {
    name: string;
    placeholder?: I18nTranslation;
    showIcon?: boolean;
};

function TextInput({ name, placeholder, showIcon = true }: Props) {
    const { field } = useController({
        defaultValue: "",
        name,
    });

    return (
        <div className="relative">
            <input
                className="
                  no-resize scrollbar-thumb-rounded scrollbar-thin w-full resize-none
                  rounded-xl bg-white/80 px-5 py-3 text-lg scrollbar-thumb-neutral-800
                  scrollbar-track-transparent
                  focus:bg-white
                "
                onChange={field.onChange}
                placeholder={placeholder?.[i18n.locale as I18nLocale]}
                value={field.value}
            />
        </div>
    );
}

export default TextInput;
