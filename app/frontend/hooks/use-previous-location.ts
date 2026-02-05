import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { RouteStrings, Strings } from "@/constants";

function usePreviousLocation() {
    const router = useRouter();
    const [previousLocation, setPreviousLocation] = useState<string>(RouteStrings.root);

    useEffect(() => {
        return router.subscribe(Strings.onResolved, ({ fromLocation }) => {
            setPreviousLocation(fromLocation?.href ?? RouteStrings.root);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return previousLocation;
}

export default usePreviousLocation;
