import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import PageContainer from "@/components/PageContainer";
import useStore from "@/hooks/use-store";

export const Route = createFileRoute("/")({
    component: Page,
});

export default function Page() {
    const bgColor = useStore("theme", "colors.splash_screen_background");
    const navigate = useNavigate();
    const initialScreenId = useStore("systemSettings", "starting_screen_id");

    useEffect(() => {
        if (initialScreenId) {
            setTimeout(() => {
                navigate({ params: { id: initialScreenId }, to: "/screens/$id" });
            }, 2500);
        }
    }, [initialScreenId, navigate]);

    return (
        <PageContainer style={{ backgroundColor: bgColor }}>splash page</PageContainer>
    );
}
