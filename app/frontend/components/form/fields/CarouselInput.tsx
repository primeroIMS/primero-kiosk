import { useDirection } from "@base-ui/react/direction-provider";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import useOptions, { OptionsConfig } from "@/hooks/use-options";
import { StoreDataMap } from "@/hooks/use-store";
import i18n, { I18nLocale } from "@/translations";
import { Meta } from "@/type";

type Props = {
    iconName: string;
    name: string;
    optionColors?: Meta;
    options: OptionsConfig<keyof StoreDataMap>;
};

function CarouselInput({ iconName, name, optionColors, options: optionsConfig }: Props) {
    const { field } = useController({
        defaultValue: "",
        name,
    });
    const { field: iconField } = useController({ defaultValue: "", name: iconName });
    const direction = useDirection();
    const [api, setApi] = useState<CarouselApi>();
    const options = useOptions(optionsConfig);

    useEffect(() => {
        if (!api) {
            return;
        }

        function setSlide(_api: CarouselApi) {
            const slide = _api?.slidesInView()?.[0];
            const selectedOption = options[slide || 0];
            field.onChange(selectedOption.value);
            iconField.onChange(selectedOption.icon as string);
        }

        setSlide(api);
        api.on("slidesInView", setSlide);

        return () => {
            api.off("slidesInView", setSlide);
        };
    }, [api, field, iconField, options]);

    return (
        <Carousel
            className="w-full"
            dir={direction}
            opts={{
                direction: direction,
                loop: true,
            }}
            setApi={setApi}
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
                                    style={{
                                        background: `url(${option.icon}) center / cover no-repeat`,
                                    }}
                                ></CardContent>
                            </Card>
                            <div className="mt-5 text-2xl font-bold">
                                {option.label?.[i18n.locale as I18nLocale]}
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious
                className="start-3 top-41"
                size="icon-lg"
                style={{ backgroundColor: optionColors?.bg_color }}
                variant="ghost"
            />
            <CarouselNext
                className="end-3 top-41"
                size="icon-lg"
                style={{ backgroundColor: optionColors?.bg_color }}
                variant="ghost"
            />
        </Carousel>
    );
}

export default CarouselInput;
