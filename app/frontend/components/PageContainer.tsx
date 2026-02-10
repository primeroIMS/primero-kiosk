import { PropsWithChildren, useEffect } from "react";

import { cn } from "@/lib/utils";

type Props = {
    bgColor?: string;
    centered?: boolean;
    className?: string;
    color?: string;
    style?: React.CSSProperties;
};

function PageContainer({
    bgColor,
    centered,
    children,
    className,
    style,
}: PropsWithChildren<Props>) {
    useEffect(() => {
        if (bgColor) {
            document.documentElement.style.backgroundColor = bgColor;
            document.body.style.backgroundColor = bgColor;
        }
    }, [bgColor]);

    useEffect(() => {
        window.scrollTo({
            behavior: "smooth",
            top: 0,
        });
    }, [children]);

    return (
        <div
            className={cn(
                "gap-4 bg-[--page-bg] px-5 py-10 select-none",
                centered && "flex h-screen flex-col items-center justify-center",
                className,
            )}
            style={
                {
                    "--page-bg": bgColor,
                    ...style,
                } as React.CSSProperties
            }
        >
            <div className="mx-auto mt-10 w-full max-w-lg text-center">{children}</div>
        </div>
    );
}

export default PageContainer;
