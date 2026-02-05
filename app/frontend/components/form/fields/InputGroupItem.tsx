import { isEmpty } from "lodash-es";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

import I18nText from "@/components/I18nText";
import Icon from "@/components/Icon";
import { Strings } from "@/constants";
import { LookupOption } from "@/type";

type Props = {
    field: ControllerRenderProps<FieldValues, string>;
    multiple?: boolean;
    name: string;
    option: LookupOption;
    type?: "checkbox" | "radio";
};

function InputGroupItem({
    field,
    multiple = false,
    name,
    option,
    type = Strings.radio,
}: Props) {
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked, value } = event.target;
        console.log(multiple);
        if (multiple) {
            if (checked) {
                field.onChange([...field.value, value]);
            } else {
                field.onChange(field.value.filter((v: string) => v !== value));
            }
        } else {
            field.onChange(value);
        }
    }

    return (
        <div className="aspect-square size-40">
            <input
                checked={field.value.includes(option.value)}
                className="peer hidden"
                id={option.value}
                name={name}
                onChange={handleChange}
                required
                type={type}
                value={option.value}
            />
            <label
                className="
                  flex aspect-square cursor-pointer flex-col gap-10 rounded-lg bg-white/80
                  p-5 text-left
                  peer-checked:bg-white
                  hover:bg-white/80
                  peer-checked:hover:bg-white
                "
                htmlFor={option.value}
            >
                {option.icon && (
                    <Icon
                        className="size-8"
                        src={option.icon}
                    />
                )}
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
    );
}

export default InputGroupItem;
