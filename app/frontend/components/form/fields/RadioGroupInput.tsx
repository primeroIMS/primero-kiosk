import { PropsWithChildren } from "react";
import { useController } from "react-hook-form";

import useOptions, { OptionsConfig } from "@/hooks/use-options";
import { StoreDataMap } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { Meta } from "@/type";

import { calculateSpan } from "../utils";
import InputGroupItem, { RadioItemVariants } from "./InputGroupItem";

type Props = {
    className?: string;
    itemClasses?: string;
    name: string;
    optionColors?: Meta;
    options: OptionsConfig<keyof StoreDataMap>;
    type?: "number" | "text";
} & RadioItemVariants;

function RadioGroupInput({
    children,
    className,
    name,
    optionColors,
    options: optionsConfig,
    type,
    variant,
}: PropsWithChildren<Props>) {
    const { field } = useController({
        defaultValue: type === "number" ? null : "",
        name,
    });

    const options = useOptions(optionsConfig);
    const sortedOptions = [...options].sort(
        (a, b) => (a.meta?.order || 0) - (b.meta?.order || 0),
    );

    return (
        <div
            className={cn(
                "mx-auto flex w-8/12 flex-wrap justify-center gap-4",
                className,
                sortedOptions.length > 4 && "w-full justify-center",
            )}
        >
            {children}
            {sortedOptions.map((option, index) => (
                <InputGroupItem
                    field={field}
                    inputType={type}
                    key={option.value}
                    name={name}
                    option={option}
                    optionColors={optionColors}
                    span={calculateSpan(index, variant, sortedOptions.length)}
                    variant={variant}
                />
            ))}
        </div>
    );
}

export default RadioGroupInput;
