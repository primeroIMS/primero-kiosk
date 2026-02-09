import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { Link } from "@tanstack/react-router";
import { VariantProps } from "class-variance-authority";
import { Scope } from "i18n-js";
import { PropsWithChildren } from "react";

import i18n from "@/translations";

import { buttonVariants, Button as UIButton } from "./ui/button";

type Props = {
    bgColor?: string;
    text?: Scope;
    textColor?: string;
    to?: string;
} & ButtonPrimitive.Props &
    VariantProps<typeof buttonVariants>;

function Button({
    bgColor,
    children,
    text,
    textColor,
    to,
    ...rest
}: PropsWithChildren<Props>) {
    const render = children ? children : text && i18n.t(text);

    if (to) {
        return (
            <UIButton
                nativeButton={false}
                render={<Link to={to}>{render}</Link>}
                {...rest}
            />
        );
    }

    return (
        <UIButton
            {...rest}
            className="font-bold"
            size="lg"
            style={{ backgroundColor: bgColor, color: textColor }}
        >
            {render}
        </UIButton>
    );
}

export default Button;
