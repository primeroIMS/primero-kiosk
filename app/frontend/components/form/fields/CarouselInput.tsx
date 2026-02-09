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
    console.log(direction);
    return (
        <Carousel
            className="w-full"
            dir={direction}
            opts={{
                direction: direction,
            }}
        >
            <CarouselContent>
                {options.map((option) => (
                    <CarouselItem key={option.value}>
                        <div className="p-1">
                            <Card
                                aria-selected={field.value === option.value}
                                className="
                                  cursor-pointer
                                  aria-selected:bg-(--selected-bg) aria-selected:ring-4
                                  aria-selected:ring-(--selected-border)
                                "
                                onClick={() =>
                                    handleOnChange(option.value, option.icon as string)
                                }
                                style={
                                    {
                                        "--selected-bg": optionColors?.bg_selected_color,
                                        "--selected-border":
                                            optionColors?.border_selected_color,
                                    } as React.CSSProperties
                                }
                            >
                                <CardContent
                                    className="
                                      flex aspect-square items-center justify-center p-6
                                    "
                                >
                                    <Icon src={option.icon as string} />
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
                className="-left-20 size-15 text-2xl"
                size="icon-lg"
                variant="default"
            />
            <CarouselNext
                className="-right-20 size-15 text-2xl"
                size="icon-lg"
                variant="default"
            />
        </Carousel>
    );
}

export default CarouselInput;
