import { useController } from "react-hook-form";

import { OptionsConfig } from "@/hooks/use-options";

type Props = {
    name: string;
    options: OptionsConfig;
};

function RadioGroupInput({ name, optionsConfig }: Props) {
    const { field } = useController({ defaultValue: "", name });

    const options = [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
    ]; // useOptions(optionsConfig);

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {options.map((option) => (
                <div>
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
                            <div className="w-full font-semibold">{option.label}</div>
                            {option.description && (
                                <div className="w-full">{option.description}</div>
                            )}
                        </div>
                    </label>
                </div>
            ))}
        </div>
    );
}

export default RadioGroupInput;
