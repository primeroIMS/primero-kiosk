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

const TURNSTILE_READY_TIMEOUT_MS = 10000;

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

function waitForTurnstile(timeoutMs = TURNSTILE_READY_TIMEOUT_MS): Promise<boolean> {
    return new Promise((resolve) => {
        const startedAt = Date.now();

        const check = () => {
            if (window.turnstile) return resolve(true);
            if (Date.now() - startedAt >= timeoutMs) return resolve(false);

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
                retry: "auto",
                "retry-interval": 2000,
                sitekey: captcha.site_key,
                "timeout-callback": () => {
                    FormStore.setCaptchaResponse("");
                },
            });
        },
    },
} as const;

function Captcha() {
    const ref = useRef<HTMLDivElement>(null);
    const captcha = useStore(Strings.systemSettings, Strings.captcha);
    const provider = captcha?.provider;
    const siteKey = captcha?.site_key;

    useEffect(() => {
        let isUnmounted = false;
        let widgetId: string | undefined;

        const providerConfig = configuration?.[provider];

        const initializeCaptcha = async () => {
            if (!providerConfig || !provider || !siteKey) return;

            const el = await waitForRef(ref);
            const isTurnstileReady = await waitForTurnstile();

            if (!el || !isTurnstileReady || isUnmounted) return;

            // Ensure we don't stack widgets if this effect reruns with updated captcha settings.
            el.innerHTML = "";
            FormStore.setCaptchaResponse("");

            widgetId = providerConfig.render({
                captcha: {
                    provider,
                    site_key: siteKey,
                },
                el,
            });
        };

        initializeCaptcha();

        return () => {
            isUnmounted = true;

            if (!widgetId) return;

            providerConfig?.cleanup(widgetId);
            FormStore.setCaptchaResponse("");
        };
    }, [provider, siteKey]);

    return <div ref={ref}></div>;
}

export default Captcha;
