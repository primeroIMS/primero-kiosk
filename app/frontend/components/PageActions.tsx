import { useNavigate } from "@tanstack/react-router";
import { Loader } from "lucide-react";

import Button from "@/components/Button";
import { Strings } from "@/constants";
import usePreviousLocation from "@/hooks/use-previous-location";
import { cn } from "@/lib/utils";
import i18n from "@/translations";
import { UseScreenReturn } from "@/type";

import ExitFlow from "./ExitFlow";
import I18nText from "./I18nText";

type Props = {
    isForm?: boolean;
    loading?: boolean;
    screen: UseScreenReturn;
};

function PageActions({ isForm, loading, screen }: Props) {
    const navigate = useNavigate();
    const previousLocation = usePreviousLocation();

    const nextButtonProps = {
        ...(isForm && { form: Strings.form, type: Strings.submit }),
        ...(!isForm && { onClick: screen.onNext }),
    } as React.ButtonHTMLAttributes<HTMLButtonElement>;

    return (
        <div>
            <div
                className={cn(
                    "mt-5 mb-3 flex flex-row items-center justify-between md:mt-10",
                    !screen.flow.allow_back &&
                        !screen.flow.allow_skip &&
                        "justify-center",
                )}
            >
                {screen.flow.allow_back ||
                    (screen.flow.allow_skip && (
                        <div className="flex grow flex-row gap-3">
                            {screen.flow.allow_back && (
                                <Button
                                    onClick={() => navigate({ to: previousLocation })}
                                    variant={Strings.outline}
                                >
                                    <I18nText
                                        fallback={Strings.buttonsBack}
                                        text={screen.flow.label_back}
                                    />
                                </Button>
                            )}
                            {screen.flow.allow_skip && (
                                <Button
                                    onClick={screen.onNext}
                                    variant={Strings.outline}
                                >
                                    <I18nText
                                        fallback={Strings.buttonsSkip}
                                        text={screen.flow.label_skip}
                                    />
                                </Button>
                            )}
                        </div>
                    ))}
                <div>
                    <Button
                        {...nextButtonProps}
                        bgColor={screen.button.bg_color}
                        disabled={loading}
                        textColor={screen.button.text_color}
                        variant={Strings.secondary}
                    >
                        {loading ? (
                            <>
                                <Loader className="animate-spin" />{" "}
                                {i18n.t("buttons.saving")}
                            </>
                        ) : (
                            <I18nText
                                fallback={Strings.buttonsContinue}
                                text={screen.flow.label_next}
                            />
                        )}
                    </Button>
                </div>
            </div>
            {screen.flow.allow_exit && (
                <ExitFlow
                    bgColor={screen.meta.exit_flow_bg_color}
                    buttonColor={screen.button.bg_color}
                />
            )}
        </div>
    );
}

export default PageActions;
