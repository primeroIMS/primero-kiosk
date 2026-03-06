import { useController } from "react-hook-form";

import useOptions, { OptionsConfig } from "@/hooks/use-options";
import { StoreDataMap } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { Meta } from "@/type";

import { calculateSpan } from "../utils";
import InputGroupItem from "./InputGroupItem";

type Props = {
    className?: string;
    cols?: 2 | 3;
    name: string;
    optionColors?: Meta;
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
    const sortedOptions = [...options].sort(
        (a, b) => (a.meta?.order || 0) - (b.meta?.order || 0),
    );
    return (
        <div
            className={cn(
                "mx-auto flex w-8/12 flex-wrap justify-center gap-3 md:gap-4",
                className,
                sortedOptions.length > 4 && "w-full justify-center",
            )}
        >
            {sortedOptions.map((option, index) => (
                <InputGroupItem
                    field={field}
                    key={option.value}
                    multiple
                    name={name}
                    option={option}
                    optionColors={optionColors}
                    span={calculateSpan(index, "", sortedOptions.length)}
                    type="checkbox"
                />
            ))}
        </div>
    );
}

export default CheckboxGroup;
