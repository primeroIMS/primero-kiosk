import { isEmpty } from "lodash-es";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

import I18nText from "@/components/I18nText";
import Icon from "@/components/Icon";
import { Strings } from "@/constants";
import { cn } from "@/lib/utils";
import { LookupOption, ScreenElement } from "@/type";

type Props = {
    centerText?: boolean;
    field: ControllerRenderProps<FieldValues, string>;
    iconLarge?: boolean;
    multiple?: boolean;
    name: string;
    option: LookupOption;
    optionColors?: ScreenElement;
    outlined?: boolean;
    type?: "checkbox" | "radio";
};

function InputGroupItem({
    centerText,
    field,
    iconLarge,
    multiple = false,
    name,
    option,
    optionColors,
    outlined,
    type = Strings.radio,
}: Props) {
    console.log(optionColors);
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked, value } = event.target;

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
        <div className={cn("aspect-square min-w-40 rounded-3xl")}>
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
                className={cn(
                    `
                      flex h-full cursor-pointer flex-col justify-between gap-3 rounded-lg
                      bg-white/80 p-5 text-left
                    `,
                    optionColors?.text_color && "text-(--text-color)",
                    centerText && "text-center",
                    outlined && "bg-transparent! outline-2 outline-(--border-color)",
                    optionColors?.bg_selected_color && "peer-checked:bg-(--selected-bg)",
                    optionColors?.border_selected_color &&
                        "peer-checked:outline-3 peer-checked:outline-(--selected-border)",
                    optionColors?.text_selected_color &&
                        "peer-checked:text-(--selected-text)",
                )}
                htmlFor={option.value}
                style={
                    {
                        "--border-color": optionColors?.border_color,
                        "--selected-bg": optionColors?.bg_selected_color,
                        "--selected-border": optionColors?.border_selected_color,
                        "--selected-text": optionColors?.text_selected_color,
                        "--text-color": optionColors?.text_color,
                    } as React.CSSProperties
                }
            >
                {option.icon && (
                    <div className={cn("flex w-full", centerText && "justify-center")}>
                        <Icon
                            className={cn("size-8", iconLarge && "size-20")}
                            src={option.icon}
                        />
                    </div>
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
