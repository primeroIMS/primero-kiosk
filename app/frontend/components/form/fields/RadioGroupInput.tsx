import { PropsWithChildren } from "react";
import { useController } from "react-hook-form";

import useOptions, { OptionsConfig } from "@/hooks/use-options";
import { StoreDataMap } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { Meta } from "@/type";

import InputGroupItem from "./InputGroupItem";

type Props = {
    centerText?: boolean;
    className?: string;
    cols?: 2 | 3;
    iconLarge?: boolean;
    itemClasses?: string;
    name: string;
    optionColors?: Meta;
    options: OptionsConfig<keyof StoreDataMap>;
    outlined?: boolean;
};

function RadioGroupInput({
    centerText,
    children,
    className,
    cols = 3,
    iconLarge,
    name,
    optionColors,
    options: optionsConfig,
    outlined,
}: PropsWithChildren<Props>) {
    const { field } = useController({
        defaultValue: "",
        name,
    });

    const options = useOptions(optionsConfig);
    const sortedOptions = [...options].sort(
        (a, b) => (a.meta?.order || 0) - (b.meta?.order || 0),
    );

    return (
        <div
            className={cn(
                "flex w-full flex-row flex-wrap justify-center gap-3",
                className,
            )}
        >
            {children}
            {sortedOptions.map((option) => (
                <InputGroupItem
                    centerText={centerText}
                    field={field}
                    iconLarge={iconLarge}
                    key={option.value}
                    name={name}
                    option={option}
                    optionColors={optionColors}
                    outlined={outlined}
                />
            ))}
        </div>
    );
}

export default RadioGroupInput;
