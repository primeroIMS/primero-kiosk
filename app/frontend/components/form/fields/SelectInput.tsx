import { useController } from "react-hook-form";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useOptions, { OptionsConfig } from "@/hooks/use-options";
import i18n from "@/translations";

type Props = {
    getI18nLabelFromName?: boolean;
    label?: string;
    name: string;
    optionsConfig: OptionsConfig;
};

function SelectInput({
    getI18nLabelFromName = false,
    label,
    name,
    optionsConfig,
}: Props) {
    const { field } = useController({ defaultValue: "", name });
    const fieldLabel = getI18nLabelFromName
        ? i18n.t(`form.select_input.${name}.label`)
        : label;
    const options = useOptions(optionsConfig);

    return (
        <Select
            items={options}
            onValueChange={field.onChange}
            value={field.value}
        >
            <SelectTrigger className="w-full min-w-60">
                <SelectValue placeholder={fieldLabel} />
            </SelectTrigger>
            <SelectContent className="w-50">
                <SelectGroup>
                    {options.map((item) => (
                        <SelectItem
                            key={item.value}
                            value={item.value}
                        >
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

export default SelectInput;
