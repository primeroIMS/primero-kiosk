import { useController } from "react-hook-form";

import i18n, { I18nLocale } from "@/translations";
import { I18nTranslation } from "@/type";

type Props = {
    name: string;
    placeholder?: I18nTranslation;
    type?: string;
};

function TextInput({ name, placeholder, type }: Props) {
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
                type={type || "text"}
                value={field.value}
            />
        </div>
    );
}

export default TextInput;
