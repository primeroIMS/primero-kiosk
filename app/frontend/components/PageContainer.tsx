import { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type Props = {
    className?: string;
    color?: string;
    style?: React.CSSProperties;
};

function PageContainer({ children, className, style }: PropsWithChildren<Props>) {
    return (
        <div
            className={cn(
                "flex h-screen flex-col items-center justify-center gap-4 bg-gray-800",
                className,
            )}
            style={style}
        >
            {children}
        </div>
    );
}

export default PageContainer;
