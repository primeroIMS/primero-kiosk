import { useController } from "react-hook-form";

import useOptions, { OptionsConfig } from "@/hooks/use-options";
import { StoreDataMap } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { ScreenElement } from "@/type";

import InputGroupItem from "./InputGroupItem";

type Props = {
    className?: string;
    cols?: 2 | 3;
    name: string;
    optionColors?: ScreenElement;
    options: OptionsConfig<keyof StoreDataMap>;
};

function CheckboxGroup({
    className,
    cols = 3,
    name,
    optionColors,
    options: optionsConfig,
}: Props) {
    const { field } = useController({
        defaultValue: [],
        name,
    });
    const options = useOptions(optionsConfig);

    return (
        <div
            className={cn(
                "grid grid-flow-row-dense gap-4",
                cols === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3",
                className,
            )}
        >
            {options.map((option) => (
                <InputGroupItem
                    field={field}
                    key={option.value}
                    multiple
                    name={name}
                    option={option}
                    optionColors={optionColors}
                    type="checkbox"
                />
            ))}
        </div>
    );
}

export default CheckboxGroup;
