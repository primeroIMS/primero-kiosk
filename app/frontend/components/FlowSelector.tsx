import { useDirection } from "@base-ui/react/direction-provider";
import { useEffect, useState } from "react";

import Icon from "@/components/Icon";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import i18n from "@/translations";
import { AppFlow } from "@/type";

import Button from "./Button";

type Props = {
    flows: AppFlow[];
};

function FlowSelector({ flows }: Props) {
    const direction = useDirection();
    const [selectedFlow, setSelectedFlow] = useState<AppFlow>();
    const [api, setApi] = useState<CarouselApi>();

    useEffect(() => {
        if (!api) {
            return;
        }

        function setSlide(_api: CarouselApi) {
            const slide = _api?.slidesInView()?.[0];
            setSelectedFlow(flows[slide || 0]);
        }

        setSlide(api);
        api.on("slidesInView", setSlide);

        return () => {
            api.off("slidesInView", setSlide);
        };
    }, [api, flows]);

    return (
        <div className="flex flex-col items-center gap-12">
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
                    {flows.map((flow) => (
                        <CarouselItem key={flow.handle}>
                            <div className="p-1">
                                <Card
                                    aria-selected={flow.handle === selectedFlow?.handle}
                                    className="
                                      cursor-pointer bg-(--option-bg) object-cover p-0
                                      aria-selected:ring-4
                                      aria-selected:ring-(--selected-border)
                                    "
                                    style={
                                        {
                                            "--option-bg": flow.meta.bg_color,
                                            "--selected-bg": flow.meta.bg_selected_color,
                                            "--selected-border":
                                                flow.meta.border_selected_color,
                                        } as React.CSSProperties
                                    }
                                >
                                    <CardContent
                                        className="
                                          flex aspect-square h-80 items-center
                                          justify-center
                                        "
                                    >
                                        <Icon
                                            className="w-2/4"
                                            src={flow.logo as string}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious
                    className="start-3 top-41"
                    size="icon-lg"
                    variant="ghost"
                />
                <CarouselNext
                    className="end-3 top-41"
                    size="icon-lg"
                    variant="ghost"
                />
            </Carousel>
            <Button
                disabled={!selectedFlow?.handle && !selectedFlow?.starting_screen_id}
                params={{
                    flow: selectedFlow?.handle,
                    id: selectedFlow?.starting_screen_id,
                }}
                to="/$flow/$id"
            >
                {i18n.t("buttons.get_started")}
            </Button>
        </div>
    );
}

export default FlowSelector;
