import Button from "@/components/Button";
import Form from "@/components/form/Form";
import useScreen from "@/hooks/use-screen";
import { type Screen } from "@/type";

import RadioGroupInput from "../form/fields/RadioGroupInput";

type Props = {
    config: Screen;
};

function SingleSelect({ config }: Props) {
    const fields = useScreen(config);

    function onSubmit(data: Record<string, any>) {
        // shareable next_screen logic can be implemented here, extracted into hook
        console.log("Form submitted with data:", data);
        // navigate({ params: { id: "next-screen-id" }, to: "." });
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <RadioGroupInput
                    name={fields.name("input_1")}
                    options={{
                        key: fields.prop("input_1", "lookup"),
                    }}
                />
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
