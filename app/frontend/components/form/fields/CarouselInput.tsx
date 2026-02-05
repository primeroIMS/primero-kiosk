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

type Props = {
    name: string;
    options: OptionsConfig<keyof StoreDataMap>;
};

function CarouselInput({ name, options: optionsConfig }: Props) {
    const { field } = useController({ defaultValue: "", name });
    const options = useOptions(optionsConfig);

    return (
        <Carousel className="w-full">
            <CarouselContent>
                {options.map((option) => (
                    <CarouselItem key={option.value}>
                        <div className="p-1">
                            <Card
                                aria-selected={field.value === option.value}
                                className="
                                  cursor-pointer
                                  aria-selected:bg-amber-200 aria-selected:ring-4
                                  aria-selected:ring-amber-300
                                "
                                onClick={() => field.onChange(option.value)}
                            >
                                <CardContent
                                    className="
                                      flex aspect-square items-center justify-center p-6
                                    "
                                >
                                    <Icon src={option.icon} />
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
                className="-right-20 size-15"
                size="icon-lg"
                variant="default"
            />
        </Carousel>
    );
}

export default CarouselInput;
