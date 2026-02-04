import { isEmpty } from "lodash-es";
import { useController } from "react-hook-form";

import I18nText from "@/components/I18nText";
import useOptions, { OptionsConfig } from "@/hooks/use-options";
import { StoreDataMap } from "@/hooks/use-store";

type Props = {
    name: string;
    options: OptionsConfig<keyof StoreDataMap>;
};

function RadioGroupInput({ name, options: optionsConfig }: Props) {
    const { field } = useController({ defaultValue: "", name });

    const options = useOptions(optionsConfig);

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {options.map((option) => (
                <div key={option.value}>
                    <input
                        className="peer hidden"
                        id={option.value}
                        name={name}
                        onChange={field.onChange}
                        required
                        type="radio"
                        value={option.value}
                    />
                    <label
                        className="
                          flex aspect-square cursor-pointer flex-col gap-10 rounded-lg
                          bg-white/50 p-5 text-left
                          peer-checked:bg-white
                          hover:bg-white/80
                          peer-checked:hover:bg-white
                        "
                        htmlFor={option.value}
                    >
                        <img
                            alt="icon"
                            src="icon"
                        />
                        <div className="block">
                            <div className="w-full font-semibold">
                                <I18nText text={option.label} />
                            </div>
                            {!isEmpty(option.description) && (
                                <div className="w-full">
                                    <I18nText text={option.description} />
                                </div>
                            )}
                        </div>
                    </label>
                </div>
            ))}
        </div>
    );
}

export default RadioGroupInput;
