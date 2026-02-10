import { useDirection } from "@base-ui/react/direction-provider";
import { useController } from "react-hook-form";

import Icon from "@/components/Icon";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import useOptions, { OptionsConfig } from "@/hooks/use-options";
import { StoreDataMap } from "@/hooks/use-store";
import i18n, { I18nLocale } from "@/translations";
import { ScreenElement } from "@/type";

type Props = {
    iconName: string;
    name: string;
    optionColors?: ScreenElement;
    options: OptionsConfig<keyof StoreDataMap>;
};

function CarouselInput({ iconName, name, optionColors, options: optionsConfig }: Props) {
    const { field } = useController({
        defaultValue: "",
        name,
    });
    const { field: iconField } = useController({ defaultValue: "", name: iconName });
    const direction = useDirection();

    const options = useOptions(optionsConfig);

    function handleOnChange(value: string, icon: string) {
        field.onChange(value);
        iconField.onChange(icon);
    }

    return (
        <Carousel
            className="w-full"
            dir={direction}
            opts={{
                direction: direction,
                loop: true,
            }}
        >
            <CarouselContent>
                {options.map((option) => (
                    <CarouselItem key={option.value}>
                        <div className="p-1">
                            <Card
                                aria-selected={field.value === option.value}
                                className="
                                  cursor-pointer bg-(--option-bg) object-cover p-0
                                  aria-selected:ring-4
                                  aria-selected:ring-(--selected-border)
                                "
                                onClick={() =>
                                    handleOnChange(option.value, option.icon as string)
                                }
                                style={
                                    {
                                        "--option-bg": option.meta.bg_color,
                                        "--selected-bg": optionColors?.bg_selected_color,
                                        "--selected-border":
                                            optionColors?.border_selected_color,
                                    } as React.CSSProperties
                                }
                            >
                                <CardContent
                                    className="
                                      flex aspect-square h-80 items-center justify-center
                                    "
                                >
                                    <Icon
                                        className="h-full"
                                        src={option.icon as string}
                                    />
                                </CardContent>
                            </Card>
                            <div className="mt-5 text-2xl font-bold">
                                {option.label?.[i18n.locale as I18nLocale]}
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious
                className="top-41 left-3"
                size="icon-lg"
                style={{ backgroundColor: optionColors?.bg_color }}
                variant="ghost"
            />
            <CarouselNext
                className="top-41 right-3"
                size="icon-lg"
                style={{ backgroundColor: optionColors?.bg_color }}
                variant="ghost"
            />
        </Carousel>
    );
}

export default CarouselInput;
