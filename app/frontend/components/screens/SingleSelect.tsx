import Button from "@/components/Button";
import Form from "@/components/form/Form";
import PageContainer from "@/components/PageContainer";
import { PrimitiveRecord } from "@/type";

type Props = {
    bgColor?: string;
    onSubmit: (data: PrimitiveRecord) => void;
};

function SingleSelect({ bgColor, onSubmit }: Props) {
    return (
        <PageContainer style={{ backgroundColor: bgColor }}>
            <Form onSubmit={onSubmit}></Form>
            <Button
                form="form"
                text="buttons.continue"
                type="submit"
                variant="secondary"
            />
        </PageContainer>
    );
}

export default SingleSelect;
