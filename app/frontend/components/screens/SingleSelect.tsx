import { useNavigate } from "@tanstack/react-router";

import Button from "@/components/Button";
import Form from "@/components/form/Form";
import { Screen } from "@/type";

import RadioGroupInput from "../form/fields/RadioGroupInput";
import useField from "../form/use-field";

type Props = {
    config: Screen;
};

function SingleSelect({ config }: Props) {
    const navigate = useNavigate();
    const fields = useField(config);

    function onSubmit(data: Record<string, any>) {
        // shareable next_screen logic can be implemented here, extracted into hook
        console.log("Form submitted with data:", data);
        // navigate({ params: { id: "next-screen-id" }, to: "." });
    }

    return (
        <>
            <Form
                onSubmit={onSubmit}
                persist
            >
                <RadioGroupInput name={fields.fields.option_select.backend_id} />
            </Form>
            <Button
                form="form"
                text="buttons.continue"
                type="submit"
                variant="secondary"
            />
        </>
    );
}

export default SingleSelect;
