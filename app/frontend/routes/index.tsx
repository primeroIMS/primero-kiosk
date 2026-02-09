import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import Logo from "@/components/Logo";
import PageContainer from "@/components/PageContainer";
import useStore from "@/hooks/use-store";

export const Route = createFileRoute("/")({
    component: Page,
});

export default function Page() {
    const bgColor = useStore("theme", "colors.splash_screen");
    const flow = useStore("systemSettings", "flow");
    const navigate = useNavigate();
    const initialScreenId = useStore("systemSettings", "starting_screen_id");

    useEffect(() => {
        if (initialScreenId) {
            setTimeout(() => {
                navigate({ params: { flow, id: initialScreenId }, to: "/$flow/$id" });
            }, 2500);
        }
    }, [initialScreenId, navigate, flow]);

    return (
        <PageContainer style={{ backgroundColor: bgColor }}>
            <Logo />
        </PageContainer>
    );
}
