import { PropsWithChildren } from "react";

type Props = {
    color?: string;
};

function PageTitle({ children, color }: PropsWithChildren<Props>) {
    return (
        <h1
            className="text-center text-3xl font-bold mb-3"
            style={{ color }}
        >
            {children}
        </h1>
    );
}

export default PageTitle;
