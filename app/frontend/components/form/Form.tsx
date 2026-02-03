import { DevTool } from "@hookform/devtools";
import { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import FormStore from "@/stores/form";
import { FormValues } from "@/type";

type Props = {
    className?: string;
    debug?: boolean;
    id?: string;
    onSubmit: (data: FormValues) => void;
    persist?: boolean;
};

function Form({
    children,
    className,
    debug = false,
    id = "form",
    onSubmit,
    persist = true,
}: PropsWithChildren<Props>) {
    const methods = useForm<FormValues>();
    const { handleSubmit } = methods;

    function submit(data: FormValues) {
        if (persist) {
            FormStore.set(data);
        }
        onSubmit(data);
    }

    return (
        <FormProvider {...methods}>
            <form
                className={cn("mb-20", className)}
                id={id}
                onSubmit={handleSubmit(submit)}
            >
                {children}
            </form>
            {debug && <DevTool control={methods.control} />}
        </FormProvider>
    );
}

export default Form;
