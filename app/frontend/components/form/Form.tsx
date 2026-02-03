import { DevTool } from "@hookform/devtools";
import { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { PrimitiveRecord } from "@/type";

type Props = {
    className?: string;
    debug?: boolean;
    id?: string;
    onSubmit: (data: PrimitiveRecord) => void;
};

function Form({
    children,
    className,
    debug = false,
    id = "form",
    onSubmit,
}: PropsWithChildren<Props>) {
    const methods = useForm<PrimitiveRecord>();
    const { handleSubmit } = methods;

    return (
        <FormProvider {...methods}>
            <form
                className={className}
                id={id}
                onSubmit={handleSubmit(onSubmit)}
            >
                {children}
            </form>
            {debug && <DevTool control={methods.control} />}
        </FormProvider>
    );
}

export default Form;
