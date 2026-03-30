import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

import { Strings } from "@/constants";
import useStore from "@/hooks/use-store";
import i18n, { I18nLocale } from "@/translations";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    const rtlLanguages = useStore(Strings.systemSettings, Strings.rtlLocales);
    const locale = useStore(Strings.form, Strings.kioskLanguage);

    useEffect(() => {
        if (!locale) return;
        if (rtlLanguages.includes(locale as I18nLocale)) {
            document.documentElement.dir = Strings.rtl;
        } else {
            document.documentElement.dir = Strings.ltr;
        }

        i18n.locale = locale as I18nLocale;
    }, [rtlLanguages, locale]);

    return (
        <>
            <Outlet />
            <div id="captcha" />
        </>
    );
}
