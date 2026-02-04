import Button from "@/components/Button";
import Form from "@/components/form/Form";
import useScreen from "@/hooks/use-screen";
import { type Screen } from "@/type";

import RadioGroupInput from "../form/fields/RadioGroupInput";

type Props = {
    config: Screen;
};

function SingleSelect({ config }: Props) {
    const screen = useScreen({
        config,
        onSubmit: (data) => {
            console.log("Form submitted with data:", data);
        },
    });

    return (
        <>
            <Form onSubmit={screen.onSubmit}>
                <RadioGroupInput
                    name={screen.name("input_1")}
                    options={{
                        key: screen.prop("input_1", "lookup"),
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
