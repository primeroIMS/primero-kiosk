import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { Link } from "@tanstack/react-router";
import { VariantProps } from "class-variance-authority";
import { Scope } from "i18n-js";
import { PropsWithChildren } from "react";

import i18n from "@/translations";

import { buttonVariants, Button as UIButton } from "./ui/button";

type Props = {
    text?: Scope;
    to?: string;
} & ButtonPrimitive.Props &
    VariantProps<typeof buttonVariants>;

function Button({ children, text, to, ...rest }: PropsWithChildren<Props>) {
    const render = text ? i18n.t(text) : children;
    if (to) {
        return (
            <UIButton
                nativeButton={false}
                render={<Link to={to}>{render}</Link>}
                {...rest}
            />
        );
    }

    return <UIButton {...rest}>{render}</UIButton>;
}

export default Button;
