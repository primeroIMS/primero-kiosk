import { DevTool } from "@hookform/devtools";
import { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Strings } from "@/constants";
import { cn } from "@/lib/utils";
import i18n from "@/translations";
import { FormValueRecord } from "@/type";

import { hasAnyValue } from "./utils";

type Props = {
    allowSkip?: boolean;
    className?: string;
    debug?: boolean;
    defaultValues?: Partial<FormValueRecord>;
    id?: string;
    onSubmit: (data: FormValueRecord) => void;
    persist?: boolean;
};

function Form({
    allowSkip = false,
    children,
    className,
    debug = false,
    defaultValues,
    id = Strings.form,
    onSubmit,
}: PropsWithChildren<Props>) {
    const methods = useForm<FormValueRecord>({
        defaultValues,
        shouldFocusError: false,
    });
    const { handleSubmit } = methods;

    function submit(data: FormValueRecord) {
        if (!allowSkip && !hasAnyValue(data)) {
            methods.setError("root.form", {
                message: "Form cannot be empty",
                type: "manual",
            });
            return;
        }

        onSubmit(data);
    }

    return (
        <FormProvider {...methods}>
            <form
                className={cn("mb-5 md:mb-10", className)}
                id={id}
                noValidate
                onSubmit={handleSubmit(submit)}
            >
                {!methods.formState.isValid && methods.formState.isSubmitted && (
                    <div
                        className="
                          mx-auto mb-5 w-4/5 rounded-sm bg-red-400 py-2 text-center
                          clamp-[text,xs,base,@sm,@5xl] font-semibold text-white
                          md:mb-10
                        "
                    >
                        {i18n.t("form.errors")}
                    </div>
                )}
                {children}
            </form>
            {debug && import.meta.env.DEV && <DevTool control={methods.control} />}
        </FormProvider>
    );
}

export default Form;
