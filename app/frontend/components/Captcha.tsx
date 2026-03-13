import { RefObject, useEffect, useRef } from "react";

import { Strings } from "@/constants";
import useStore from "@/hooks/use-store";
import FormStore from "@/stores/form";
import { SystemCaptcha } from "@/type";

type ConfigurationType = {
    [key: string]: {
        cleanup: (widgetId: string) => void;
        render: (args: {
            captcha: SystemCaptcha;
            el: HTMLDivElement;
        }) => string | undefined;
    };
};

function waitForRef(
    ref: RefObject<HTMLDivElement | null>,
): Promise<HTMLDivElement | null> {
    return new Promise((resolve) => {
        const check = () => {
            if (ref?.current) return resolve(ref.current);
            requestAnimationFrame(check);

            return null;
        };

        check();
    });
}

const configuration: ConfigurationType = {
    turnstile: {
        cleanup: (widgetId) => {
            if (window.turnstile && widgetId) window.turnstile.remove(widgetId);
        },
        render: ({ captcha, el }) => {
            if (!el || !window.turnstile) return;
            return window.turnstile.render(el, {
                callback: (token) => {
                    FormStore.setCaptchaResponse(token);
                },
                "error-callback": () => FormStore.setCaptchaResponse(""),
                "expired-callback": () => FormStore.setCaptchaResponse(""),
                sitekey: captcha.site_key,
            });
        },
    },
} as const;

function Captcha() {
    const ref = useRef<HTMLDivElement>(null);
    const captcha = useStore(Strings.systemSettings, Strings.captcha);

    useEffect(() => {
        (async () => {
            const el = await waitForRef(ref);

            if (!el) return undefined;

            const widgetId = configuration?.[captcha.provider]?.render({
                captcha,
                el,
            });

            return () => {
                configuration?.[captcha.provider]?.cleanup(widgetId as string);
            };
        })();
    }, [captcha, ref]);

    return <div ref={ref}></div>;
}

export default Captcha;
