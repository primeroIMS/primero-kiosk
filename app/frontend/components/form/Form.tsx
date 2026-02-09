import { DevTool } from "@hookform/devtools";
import { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Strings } from "@/constants";
import { cn } from "@/lib/utils";
import FormStore from "@/stores/form";
import i18n from "@/translations";
import { FormValues } from "@/type";

import { hasAnyValue } from "./utils";

type Props = {
    allowSkip?: boolean;
    className?: string;
    debug?: boolean;
    id?: string;
    onSubmit: (data: FormValues) => void;
    persist?: boolean;
};

function Form({
    allowSkip = false,
    children,
    className,
    debug = false,
    id = Strings.form,
    onSubmit,
    persist = true,
}: PropsWithChildren<Props>) {
    const methods = useForm<FormValues>({
        shouldFocusError: false,
    });
    const { handleSubmit } = methods;

    function submit(data: FormValues) {
        if (!allowSkip && !hasAnyValue(data)) {
            methods.setError("root.form", {
                message: "Form cannot be empty",
                type: "manual",
            });
            return;
        }

        if (persist) {
            FormStore.set(data);
        }

        onSubmit(data);
    }

    return (
        <FormProvider {...methods}>
            <form
                className={cn("mb-10", className)}
                id={id}
                noValidate
                onSubmit={handleSubmit(submit)}
            >
                {!methods.formState.isValid && methods.formState.isSubmitted && (
                    <div className="mb-10 rounded-3xl bg-red-400 py-3 font-bold text-white">
                        {i18n.t("form.errors")}
                    </div>
                )}
                {children}
            </form>
            {debug && <DevTool control={methods.control} />}
        </FormProvider>
    );
}

export default Form;
