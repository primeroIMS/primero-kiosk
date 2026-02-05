import { useController } from "react-hook-form";

import useOptions, { OptionsConfig } from "@/hooks/use-options";
import { StoreDataMap } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

import InputGroupItem from "./InputGroupItem";

type Props = {
    className?: string;
    name: string;
    options: OptionsConfig<keyof StoreDataMap>;
};

function CheckboxGroup({ className, name, options: optionsConfig }: Props) {
    const { field } = useController({ defaultValue: [], name });
    const options = useOptions(optionsConfig);

    return (
        <div
            className={cn(
                "m-auto flex flex-row flex-wrap justify-center gap-4",
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
                    type="checkbox"
                />
            ))}
        </div>
    );
}

export default CheckboxGroup;
