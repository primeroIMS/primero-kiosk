import { PropsWithChildren } from "react";

type Props = {
    color?: string;
};

function PageTitle({ children, color }: PropsWithChildren<Props>) {
    return (
        <h1
            className="mb-3 text-center text-3xl font-bold"
            style={{ color }}
        >
            {children}
        </h1>
    );
}

export default PageTitle;
