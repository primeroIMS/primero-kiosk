import { useController } from "react-hook-form";

import I18nText from "@/components/I18nText";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useOptions, { OptionsConfig } from "@/hooks/use-options";
import { StoreDataMap } from "@/hooks/use-store";
import { I18nTranslation } from "@/type";

type Props = {
    cyclePlaceholder?: boolean;
    name: string;
    optionsConfig: OptionsConfig<keyof StoreDataMap>;
    placeholder?: I18nTranslation;
};

function SelectInput({ cyclePlaceholder, name, optionsConfig, placeholder }: Props) {
    const { field } = useController({ defaultValue: "", name });
    const options = useOptions(optionsConfig);

    return (
        <Select
            items={options}
            onValueChange={field.onChange}
            value={field.value}
        >
            <SelectTrigger className="w-full min-w-60">
                <SelectValue>
                    {(item) =>
                        item ? (
                            <I18nText
                                text={
                                    options.find((option) => option.value === item)?.label
                                }
                            />
                        ) : (
                            <I18nText
                                cycleText={cyclePlaceholder}
                                text={placeholder}
                            />
                        )
                    }
                </SelectValue>
            </SelectTrigger>
            <SelectContent className="w-50">
                <SelectGroup>
                    {options.map((item) => (
                        <SelectItem
                            key={item.value}
                            value={item.value}
                        >
                            <I18nText text={item.label} />
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

export default SelectInput;
