import { PropsWithChildren } from "react";
import { useController } from "react-hook-form";

import useOptions, { OptionsConfig } from "@/hooks/use-options";
import { StoreDataMap } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

import InputGroupItem from "./InputGroupItem";

type Props = {
    centerText?: boolean;
    className?: string;
    cols?: 2 | 3;
    iconLarge?: boolean;
    itemClasses?: string;
    name: string;
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
    options: optionsConfig,
    outlined,
}: PropsWithChildren<Props>) {
    const { field } = useController({ defaultValue: "", name });

    const options = useOptions(optionsConfig);

    return (
        <div
            className={cn(
                "grid grid-flow-row-dense gap-4",
                cols === 2 ? "grid-cols-2" : "grid-cols-3",
                className,
            )}
        >
            {children}
            {options.map((option) => (
                <InputGroupItem
                    centerText={centerText}
                    field={field}
                    iconLarge={iconLarge}
                    key={option.value}
                    name={name}
                    option={option}
                    outlined={outlined}
                />
            ))}
        </div>
    );
}

export default RadioGroupInput;
